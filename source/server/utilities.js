// import external

import ShortTermMemory from 'short-term-memory';

// import internal

import permissionDatabase from './database/permissions';
import userDatabase from './database/users';

// helper functions

/**
 * @description mock impequid service provider data until it's finished
 */
export const fakeISPData = new Map();
fakeISPData.set('dns.smartfl.at', {
	url: 'https://dns.smartfl.at',
	returnUrl: 'https://dns.smartfl.at/api/authenticate/:token@:server',
	name: 'SmartFlat Dynamic DNS',
	author: {
		name: 'dodekeract',
		url: 'https://github.com/dodekeract'
	}
});
fakeISPData.set('dev.smartfl.at', {
	url: 'http://dev.smartfl.at',
	returnUrl: 'http://dev.smartfl.at/api/authenticate/:token@:server',
	name: 'SmartFlat Dynamic DNS Development Server',
	author: {
		name: 'dodekeract',
		url: 'https://github.com/dodekeract'
	}
});

/**
 * @description add user data to session
 */
export function applyLogin (session, user) {
	session.name = user.name;
	session.email = user.email;
	session.apps = user.apps;
	session.id = user._id;
}

/**
 * @description support nginx proxy and direct access
 */
export function getIP (context) {
	return context.headers['x-real-ip'] || context.ip;
}

/**
 * @description get login information from a session
 */
export function getUser (context) {
	return {
		name: context.session.name,
		valid: !!context.session.name,
		id: context.session.id
	}
}

/**
 * @description for login-only-routes
 */
export function loginify (context, callback) {
	const user = getUser(context);
	if (user.valid) {
		return callback(user);
	} else {
		context.status = 401;
		context.body = {
			error: 'unauthorized'
		};
		// TODO investigate this hack
		return [];
	}
}

/**
 * @description create authenticate accept token list
 */
export const acceptTokenStore = new ShortTermMemory({
	duration: 120000
});

// user

export function * user (next) {
	try {
		const user = yield userDatabase.getUser({
			_id: this.token.user
		});
		this.user = {
			id: user._id,
			name: user.name,
			email: user.email
		};
		yield next;
	} catch (error) {
		console.error(error);
		this.body = {
			error: 'could not get userdata'
		};
		this.status = 500;
	}
}

// permission

export function * permissions (next) {
	try {
		console.log('token', this.token);
		this.permissions = yield permissionDatabase.get({
			user: this.token.user,
			app: this.token.app
		});
		yield next;
	} catch (error) {
		console.error(error);
		this.body = {
			error: 'could not get permissions'
		};
		this.status = 500;
	}
}

function checkPermission (desired) {

	let pointer = this.permissions[this.token.type];

	// check if permission wildcard was used

	if (pointer === true) return true;

	// iterate through desired permissions
	// until true is found

	for (let i = 0; i < desired.length; i++) {
		if (pointer) {
			pointer = pointer[desired[i]];
		}
		if (pointer === true) {
			return true;
		}
	}

	// doesn't have permission

	this.body = {
		error: 'insufficient permissions'
	};
	this.status = 403;
	return false;
}

export const permission = {
	background: function * (next) {
		// has any background permission
		if (this.permissions.background === true || Object.keys(this.permissions.background).length) yield next;
	},
	user: {
		name: function * (next) {
			if (checkPermission.call(this, ['user', 'name'])) yield next;
		},
		id: function * (next) {
			if (checkPermission.call(this, ['user', 'id'])) yield next;
		}
	}
};

/**
 * @description deserializes a serialized permission tree
 * @param {string} serializedTree The serialized permission tree
 * @example background[user[name,id],notify] → {background: {user: {name: true, id: true}, notify: true}}
 */
export function deserializePermissionTree (serializedTree) {

	// resulting tree

	const result = {};

	// pointer stack

	const pointers = [result];

	// cache letters until needed

	let wordCache = '';

	// iterate through serialized tree

	for (let i = 0; i < serializedTree.length; i++) {

		switch (serializedTree[i]) {
			case '[':
				pointers[pointers.length - 1][wordCache] = {};
				pointers.push(pointers[pointers.length - 1][wordCache]);
				wordCache = '';
			break;
			case ']':
				if (wordCache.length) {
					pointers[pointers.length - 1][wordCache] = true;
					wordCache = '';
				}

				pointers.pop();
			break;
			case ',':
				if (wordCache.length) {
					pointers[pointers.length - 1][wordCache] = true;
					wordCache = '';
				}
			break;
			default:
				wordCache += serializedTree[i];
		}
	}

	// add last element, if it exists

	if (wordCache.length) {
		pointers[pointers.length - 1][wordCache] = true;
	}

	return result;
}
