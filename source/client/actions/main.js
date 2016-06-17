import d from '../dispatchers/main';
import c from '../constants/main';
import loginActions from '../actions/login';

const actions = {
	hydrate (data) {
		d.dispatch({
			type: c.HYDRATE,
			data
		});
	},
	updateApps (data) {
		d.dispatch({
			type: c.UPDATE_APPS,
			data
		});
	},
	login: loginActions
};

export default actions;
