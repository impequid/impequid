// import external
import crypto from 'crypto';
import {default as mongoose, Schema} from 'mongoose';

// import internal
import {Token} from './models';

/**
 * @desciption returns the associated data for a tokenDatabase
 */
export function get ({id}) {
	return new Promise((resolve, reject) => {
		Token.findOne({
			id
		}, (error, data) => {
			if (!error && data !== null) {
				resolve({
					app: data.app,
					user: data.user,
					id: data.id,
					type: 'normal'
				});
			} else {
				reject('not found');
			}
		});
	});
}

/**
 * @description compiles a list of all tokens of a user
 */
export function getAll ({id}) {
	return new Promise((resolve, reject) => {
		Token.find({
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
		Token.findOneAndRemove({
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
	add,
	get
};

export default exported;
