// import external
import crypto from 'crypto';
import {default as mongoose, Schema} from 'mongoose';

// import internal
import {Token} from './models';

/**
 * @description compiles a list of all tokens of a user
 */
export function getAll (user) {
	return new Promise((resolve, reject) => {
		Token.find({
			user: user.id
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
export function remove (options) {
	return new Promise ((resolve, reject) => {
		Token.findOneAndRemove({
			id: options.token,
			user: options.user.id
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
export function add (options) {
	const {user, app} = options;

	return new Promise ((resolve, reject) => {
		Token.remove({
			app,
			user: user.id
		}, () => {
			const token = new Token({
				app,
				user: user.id,
				id: crypto.randomBytes(16).toString('hex')
			});

			token.save().then(savedToken => {
				resolve(savedToken.id);
			}).catch(error => {
				reject(error);
			});
		});
	});
}

const exported = {
	getAll,
	remove,
	add
};

export default exported;
