// import external

import crypto from 'crypto';
import {default as mongoose, Schema} from 'mongoose';

// import internal

import {BackgroundToken} from './models';

/**
 * @desciption returns the associated data for a tokenDatabase
 */
export function get ({id}) {
	return new Promise((resolve, reject) => {
		BackgroundToken.findOne({
			id
		}, (error, data) => {
			if (!error && data !== null) {
				resolve({
					app: data.app,
					user: data.user,
					id: data.id,
					type: 'background'
				});
			} else {
				reject('not found');
			}
		});
	});
}

/**
 * @description returns or creates a backgroundToken for an app
 */
export function getByApp ({app, user}) {
	return new Promise((resolve, reject) => {
		BackgroundToken.findOne({
			user,
			app
		}, (error, entry) => {
			if (!error) {
				if (entry !== null) {
					resolve(entry);
				} else {
					add({user, app}).then(resolve).catch(reject);
				}
			} else {
				reject(error);
			}
		});
	});
}

/**
 * @description compiles a list of all tokens of a user
 */
export function getAll ({id}) {
	return new Promise((resolve, reject) => {
		BackgroundToken.find({
			user: id
		}, (error, tokens) => {
			if (!error) {
				resolve(tokens.map(token => {
					return {
						app: token.app,
						user: token.user,
						id: token.id
					};
				}));
			} else {
				reject('something went wrong');
			}
		});
	});
}

/**
 * @description removes the given token
 */
export function remove ({token, user}) {
	return new Promise ((resolve, reject) => {
		BackgroundToken.findOneAndRemove({
			id: token,
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
 * @description creates a new token, removes old token
 */
export function add ({user, app}) {
	return new Promise ((resolve, reject) => {
		BackgroundToken.remove({
			app,
			user: user.id
		}, () => {
			const token = new BackgroundToken({
				app,
				user: user.id,
				id: crypto.randomBytes(16).toString('hex')
			});

			token.save().then(savedBackgroundToken => {
				resolve(savedBackgroundToken.id);
			}).catch(error => {
				reject(error);
			});
		});
	});
}

const exported = {
	getAll,
	remove,
	add,
	get,
	getByApp
};

export default exported;
