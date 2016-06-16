// import external
import {default as mongoose, Schema} from 'mongoose';
import crypto from 'crypto';
import {isEmail, isAlphanumeric, isHexadecimal} from 'validator';

// import internal
import config from './config';

// connect database
mongoose.connect(config.mongo.url, (error) => {
	if (error) console.error(`could not connect to mongo ${error}`);
});
mongoose.Promise = Promise;

// user schema
const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		validate: [isAlphanumeric, 'invalid username']
	},
	email: {
		type: String,
		required: true,
		validate: [(data) => {
			// why the fuck does this fix work
			return isEmail(data);
		}, 'invalid email']
	},
	password: {
		type: String,
		required: true,
		validate: [isHexadecimal, 'invalid password']
	},
	salt: {
		type: String,
		required: true,
		validate: [isHexadecimal, 'invalid salt']
	}
});

const User = mongoose.model('user', userSchema);

// helper functions
function hashPassword (password, salt) {
	return crypto.createHash('sha512').update(`${salt}${password}`).digest('hex');
}

// exported functions
export function login (options) {
	return new Promise((resolve, reject) => {
		User.find({
			name: options.name
		}, (err, users) => {
			if (!err && users.length === 1) {
				const user = users[0];
				if (hashPassword(options.password, user.salt) === user.password) {
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

		let user = new User({
			name: options.name,
			password: hashed,
			email: options.email,
			salt: salt
		});

		user.save().then(() => {
			console.log(`user ${options.name} created`);
			resolve(user);
		}).catch(error => {
			reject('duplicate or invalid');
		});
	});
}

const exported = {
	login,
	register
};

export default exported;
