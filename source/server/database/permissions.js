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
export function add (options) {
	const {user, app, permissions} = options;

	return new Promise ((resolve, reject) => {
		Permission.findOne({
			app,
			user: user.id
		}).then((entry) => {
			if (entry !== null) {
				// add new permissions
				permissions.forEach(value => {
					if (entry.permissions.indexOf(value) === -1) {
						entry.permissions.push(value);
					}
				});

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
	add
};

export default exported;
