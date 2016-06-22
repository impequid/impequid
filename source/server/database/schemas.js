// external
import {default as mongoose, Schema} from 'mongoose';
import {isEmail, isAlphanumeric, isHexadecimal} from 'validator';

mongoose.Promise = Promise;
export const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		validate: [isAlphanumeric, 'invalid username']
	},
	email: {
		type: String,
		required: true,
		validate: [isEmail, 'invalid email']
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
	},
	apps: {
		type: [String],
		default: []
	}
});

export const tokenSchema = new Schema({
	app: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true
	},
	id: {
		type: String,
		required: true,
		unique: true,
		validate: [isAlphanumeric, 'token id must be alphanumeric']
	},
	expires: {
		type: Date,
		validate: [v => (v - Date.now() <= 86400 * 1000), 'cannot expire more than 1 day in the future'],
		default: () => Date.now() + 86400 * 1000
	}
});
tokenSchema.index({app: 1, user: 1}, {unique: true});

export const backgroundTokenSchema = new Schema({
	app: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true
	},
	id: {
		type: String,
		required: true,
		unique: true,
		validate: [isAlphanumeric, 'token id must be alphanumeric']
	}
});
backgroundTokenSchema.index({app: 1, user: 1}, {unique: true});

export const permissionSchema = new Schema({
	app: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true
	},
	permissions: {
		type: Schema.Types.Mixed,
		default: {}
	}
});
permissionSchema.index({app: 1, user: 1}, {unique: true});
