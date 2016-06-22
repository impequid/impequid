// import external
import crypto from 'crypto';
import {default as mongoose, Schema} from 'mongoose';

// import internal
import {Permission} from './models';

/**
 * @description compiles a list of all permissions of a user
 */
export function getAll (user) {
	return new Promise((resolve, reject) => {
		Permission.find({
			user: user.id
		}, (error, permissions) => {
			if (!error) {
				resolve(permissions.map(permission => {
					return {
						app: permission.app,
						user: permission.user,
						permissions: permission.permissions
					};
				}));
			} else {
				reject('something went wrong');
			}
		});
	});
}

/**
 * @description gets the permissions for a given app and user
 */
export function get ({user, app}) {
	return new Promise((resolve, reject) => {
		Permission.findOne({
			user,
			app
		}, (error, entry) => {
			if (!error && entry !== null) {
				resolve(entry.permissions);
			} else if (entry === null) {
				reject('not found');
			} else {
				reject('something went wrong');
			}
		});
	});
}

/**
 * @description removes the given Permission
 */
export function remove (options) {
	const {user, app} = options;

	return new Promise ((resolve, reject) => {
		Permission.findOneAndRemove({
			app,
			user: user.id
		}, error => {
			if (!error) {
				resolve();
			} else {
				reject(error);
			}
		});
	});
}

/**
 * @description creates a new permission, adds new permissions
 */
export function add ({user, app, permissions}) {
	return new Promise ((resolve, reject) => {
		Permission.findOne({
			app,
			user: user.id
		}).then((entry) => {
			if (entry !== null) {
				// add new permissions
				entry.permissions = permissions;

				// save to database
				entry.save().then(() => {
					resolve();
				}).catch(error => {
					reject(error);
				});
			} else {
				const permission = new Permission({
					app,
					user: user.id,
					permissions
				});

				permission.save().then(() => {
					resolve();
				}).catch(error => {
					reject(error);
				});
			}
		}).catch(error => {
			reject(error);
		});
	});
}

const exported = {
	getAll,
	remove,
	add,
	get
};

export default exported;
