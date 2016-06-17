// import external
import mongoose from 'mongoose';

// import internal
import {userSchema, tokenSchema, backgroundTokenSchema, permissionSchema} from './schemas';

// defined models
export const User = mongoose.model('user', userSchema);
export const Token = mongoose.model('token', tokenSchema);
export const BackgroundToken = mongoose.model('backgroundToken', backgroundTokenSchema);
export const Permission = mongoose.model('permission', permissionSchema);
