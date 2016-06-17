// utilities
import Store from '../utilities/store';
import {http, get, post, put, remove} from '../utilities/http';

// instances
import dispatcher from '../dispatchers/login';
import constants from '../constants/login';
import actions from '../actions/login';
import mainActions from '../actions/main';

const _state = {
	name: '',
	password: '',
	secondaryPassword: '',
	email: '',
	captcha: '',
	accepted: false,
	valid: false,
	reCaptchaKey: ''
};

class LoginStore extends Store {
	constructor () {
		super();
		this.emitChange.bind(this);
	}

	getState () {
		return _state;
	}

	emitChange (share) {
		this.emit('CHANGE');
		if (share !== false && process.browser) localStorage.setItem('login', JSON.stringify({
			name: _state.name,
			email: _state.email,
			valid: _state.valid
		}));
	}
}

const store = new LoginStore();

dispatcher.register(action => {
	console.info('login-store', action.type);

	switch (action.type) {
		case constants.HYDRATE:
			_state.name = action.data.name;
			_state.email = action.data.email;
			_state.valid = action.data.valid;
			_state.reCaptchaKey = action.data.reCaptchaKey;
		break;
		case constants.FIX_AUTOFILL:
			_state.name = action.name;
			_state.password = action.password;
		break;
		case constants.LOGOUT:
			remove('login').then(result => {
				console.info(result);
				_state.name = '';
				_state.email = '';
				_state.valid = false;
				store.emitChange();
			}).catch(error => {
				console.error(error);
			});
		break;
		case constants.VERIFY:
			get('login').then(result => {
				console.info(result);
				_state.name = result.name;
				_state.email = result.email;
				_state.valid = true;
				store.emitChange();
			}).catch(error => {
				console.error(error);
			});
		break;
		case constants.SEND:
			put('login', {
				name: _state.name,
				password: _state.password
			}).then(result => {
				console.log(result);
				_state.name = result.login.name;
				_state.email = result.login.email;
				_state.valid = true;
				mainActions.updateApps(result.apps);
				clearPassword();
				store.emitChange();
			}).catch(error => {
				console.error(error);
			});
		break;
		case constants.REGISTER:
			const exists = (value, error) => {
				if (!value) alert(error);
				return value;
			}
			if (exists(
				_state.accepted,
				'You have to accept the Privacy Policy and Terms Of Service.'
			) && exists(
				_state.captcha,
				'Captcha not completed.')
			) {
				if (_state.password === _state.secondaryPassword) {
					post('login', {
						name: _state.name,
						password: _state.password,
						email: _state.email,
						captcha: _state.captcha
					}).then(result => {
						if (result === 'success') alert(`Welcome To Impequid, ${_state.name}`);
						_state.valid = true;
						clearPassword();
						store.emitChange();
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
		case constants.UPDATE_NAME:
			_state.name = action.value;
		break;
		case constants.UPDATE_PASSWORD:
			_state.password = action.value;
		break;
		case constants.UPDATE_SECONDARY_PASSWORD:
			_state.secondaryPassword = action.value;
		break;
		case constants.UPDATE_CAPTCHA:
			_state.captcha = action.value;
		break;
		case constants.UPDATE_EMAIL:
			_state.email = action.value;
		break;
		case constants.UPDATE_ACCEPTED:
			_state.accepted = action.value;
		break;
	}

	store.emitChange();
});

// share login state acros tabs

if (process && process.browser === true) {
	window.onstorage = (event) => {
		const data = JSON.parse(localStorage.getItem('login'));
		_state.name = data.name;
		_state.email = data.email;
		_state.valid = data.valid;
		store.emitChange(false);
	};
}

//

function clearPassword () {
	_state.password = '';
	_state.secondaryPassword = '';
}

export default store;
