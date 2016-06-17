import d from '../dispatchers/authenticate';
import c from '../constants/authenticate';
import loginActions from '../actions/login';

const actions = {
	login: loginActions,
	hydrate (data) {
		d.dispatch({
			type: c.HYDRATE,
			data
		});
	}
};

export default actions;
