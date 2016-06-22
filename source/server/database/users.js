// import external
import crypto from 'crypto';

// import internal
import config from '../config';
import {User} from './models';

// helper functions
function hashPassword (password, salt) {
	return crypto.createHash('sha512').update(`${salt}${password}`).digest('hex');
}

export function getUser (query) {
	return new Promise((resolve, reject) => {
		User.findOne(query, (error, user) => {
			if (!error) {
				resolve(user);
			} else {
				reject('not found');
			}
		});
	});
}

// exported functions
export function login ({name, password}) {
	return new Promise((resolve, reject) => {
		User.findOne({
			name
		}, (err, user) => {
			if (!err && user !== null) {
				if (hashPassword(password, user.salt) === user.password) {
					resolve(user);
				} else {
					reject('wrong password');
				}
			} else {
				reject('not found');
			}
		});
	});
}

export function register (options) {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(16).toString('hex');
		const hashed = hashPassword(options.password, salt);

		const user = new User({
			name: options.name,
			password: hashed,
			email: options.email,
			salt: salt
		});

		// fix mongoose weirdness
		user.$__save({}, (error, user) => {
			if (!error) {
				console.log(`user ${options.name} created`);
				resolve(user);
			} else {
				console.error(error);
				reject('duplicate or invalid');
			}
		});
	});
}

const exported = {
	getUser,
	login,
	register
};

export default exported;
