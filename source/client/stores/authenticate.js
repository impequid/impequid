// utilities
import Store from '../utilities/store';
import {http, get, post, put, remove} from '../utilities/http';

// actions
import loginActions from '../actions/login';

// stores
import loginStore from './login';

// instances
import dispatcher from '../dispatchers/authenticate';
import constants from '../constants/authenticate';
import actions from '../actions/authenticate';

const _state = {
	login: loginStore.getState()
};

class AuthenticateStore extends Store {
	constructor () {
		super();
	}

	getState () {
		return _state;
	}
}

const store = new AuthenticateStore();

dispatcher.register(action => {
	console.info('authenticate-store', action.type);

	switch (action.type) {
		case constants.HYDRATE:
			_state.app = action.data.app;
			_state.serverName = action.data.serverName;
			loginActions.hydrate(action.data.login);
		break;
	}

	store.emitChange();
});

// subscribe to other stores
loginStore.addChangeListener(() => {
	_state.login = loginStore.getState();
	store.emitChange();
});

export default store;
