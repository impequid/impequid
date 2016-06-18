// import external

import ShortTermMemory from 'short-term-memory';

// helper functions

/**
 * @description mock impequid service provider data until it's finished
 */
export const fakeISPData = new Map();
fakeISPData.set('dns.smartfl.at', {
	url: 'https://dns.smartfl.at',
	returnUrl: 'https://dns.smartfl.at/api/authenticate/:token@:server',
	name: 'Smartflat DynDNS',
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
