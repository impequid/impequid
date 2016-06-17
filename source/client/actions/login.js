import d from '../dispatchers/login';
import c from '../constants/login';

const actions = {
	hydrate (data) {
		d.dispatch({
			type: c.HYDRATE,
			data
		});
	},
	fixAutofill (name, password) {
		d.dispatch({
			type: c.FIX_AUTOFILL,
			name,
			password
		});
	},
	logout (event) {
		event.preventDefault();
		d.dispatch({
			type: c.LOGOUT
		});
	},
	send (event) {
		event.preventDefault();
		event.stopPropagation();
		d.dispatch({
			type: c.SEND
		});
	},
	verify () {
		d.dispatch({
			type: c.VERIFY
		});
	},
	register (event) {
		event.preventDefault();
		event.stopPropagation();
		d.dispatch({
			type: c.REGISTER
		});
	},
	updatePassword (event) {
		d.dispatch({
			type: c.UPDATE_PASSWORD,
			value: event.target.value
		});
	},
	updateSecondaryPassword (event) {
		d.dispatch({
			type: c.UPDATE_SECONDARY_PASSWORD,
			value: event.target.value
		});
	},
	updateName (event) {
		d.dispatch({
			type: c.UPDATE_NAME,
			value: event.target.value
		});
	},
	updateEmail (event) {
		d.dispatch({
			type: c.UPDATE_EMAIL,
			value: event.target.value
		});
	},
	updateCaptcha (key) {
		d.dispatch({
			type: c.UPDATE_CAPTCHA,
			value: key
		});
	},
	updateAccepted (event) {
		d.dispatch({
			type: c.UPDATE_ACCEPTED,
			value: event.target.checked
		});
	}
};

export default actions;
