// external
import {navigate} from 'react-mini-router';

// classes
import Store from '../store-class';

// instances
import dispatcher from '../dispatchers/main';
import constants from '../constants/main';
import actions from '../actions/main';

const _state = {
	loggedIn: false,
	login: {
		name: '',
		password: '',
		secondaryPassword: '',
		email: '',
		captcha: '',
		accepted: false
	},
	user: {
		name: '',
		email: '',
		loggedIn: false
	}
};

class MainStore extends Store {
	constructor () {
		super();
	}

	getState () {
		return _state;
	}
}

let store = new MainStore();

store.dispatchToken = dispatcher.register(action => {
	console.info('store', action.type);

	switch (action.type) {
		case constants.LOGOUT:
			remove('login').then(result => {
				console.info(result);
				_state.user.name = '';
				_state.user.email = '';
				_state.user.loggedIn = false;
				navigate('/login');
				store.emitChange();
			}).catch(error => {
				console.error(error);
			});
		break;
		case constants.LOGIN_VERIFY:
			get('login').then(result => {
				console.info(result);
				_state.user.name = result.name;
				_state.user.email = result.email;
				_state.user.loggedIn = true;
				store.emitChange();
			}).catch(error => {
				console.error(error);
			});
		break;
		case constants.LOGIN_SEND:
			put('login', {
				name: _state.login.name,
				password: _state.login.password
			}).then(result => {
				console.log(result);
				_state.user.name = result.name;
				_state.user.email = result.email;
				_state.user.loggedIn = true;
				store.emitChange();
			}).catch(error => {
				console.error(error);
			});
		break;
		case constants.LOGIN_REGISTER:
			const exists = (value, error) => {
				if (!value) alert(error);
				return value;
			}
			if (exists(
				_state.login.accepted,
				'You have to accept the Privacy Policy and Terms Of Service.'
			) && exists(
				_state.login.captcha,
				'Captcha not completed.')
			) {
				if (_state.login.password === _state.login.secondaryPassword) {
					post('login', {
						name: _state.login.name,
						password: _state.login.password,
						email: _state.login.email,
						captcha: _state.login.captcha
					}).then(result => {
						if (result === 'success') alert('it worked');
						console.log(`success ${result}`);
					}).catch(error => {
						if (error === 'registration failed') alert('username unavailable');
						console.log(`something went wrong ${error}`)
					});
				} else {
					alert('Passwords don\'t match');
				}
			}
		break;
		case constants.LOGIN_UPDATE_NAME:
			_state.login.name = action.value;
		break;
		case constants.LOGIN_UPDATE_PASSWORD:
			_state.login.password = action.value;
		break;
		case constants.LOGIN_UPDATE_SECONDARY_PASSWORD:
			_state.login.secondaryPassword = action.value;
		break;
		case constants.LOGIN_UPDATE_CAPTCHA:
			_state.login.captcha = action.value;
		break;
		case constants.LOGIN_UPDATE_EMAIL:
			_state.login.email = action.value;
		break;
		case constants.LOGIN_UPDATE_ACCEPTED:
			_state.login.accepted = action.value;
		break;
	}

	store.emitChange();
});

export default store;

function http (method, resource, data) {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				let result;
				try {
					result = JSON.parse(request.responseText);
				} catch (error) {
					result = request.responseText;
				}

				if (request.status === 200) {
					resolve(result);
				} else {
					reject(result);
				}
			}
		}
		request.open(method, `/api/${resource}`, true);
		request.setRequestHeader("Content-type", "application/json");

		// don't send body for GET requests
		const body = method === 'get' ? '' : JSON.stringify(data);
		request.send(body);
	});
}

function get (resource, data) {
	return http('get', resource, data);
}

function post (resource, data) {
	return http('post', resource, data);
}

function put (resource, data) {
	return http('put', resource, data);
}

function remove (resource, data) {
	return http('delete', resource, data);
}
