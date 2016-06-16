import d from '../dispatchers/main';
import c from '../constants/main';

const actions = {
	logout () {
		d.dispatch({
			type: c.LOGOUT
		});
	},
	login: {
		send (event) {
			event.preventDefault();
			event.stopPropagation();
			d.dispatch({
				type: c.LOGIN_SEND
			});
		},
		verify () {
			d.dispatch({
				type: c.LOGIN_VERIFY
			});
		},
		register (event) {
			event.preventDefault();
			event.stopPropagation();
			d.dispatch({
				type: c.LOGIN_REGISTER
			});
		},
		updatePassword (event) {
			d.dispatch({
				type: c.LOGIN_UPDATE_PASSWORD,
				value: event.target.value
			});
		},
		updateSecondaryPassword (event) {
			d.dispatch({
				type: c.LOGIN_UPDATE_SECONDARY_PASSWORD,
				value: event.target.value
			});
		},
		updateName (event) {
			d.dispatch({
				type: c.LOGIN_UPDATE_NAME,
				value: event.target.value
			});
		},
		updateEmail (event) {
			d.dispatch({
				type: c.LOGIN_UPDATE_EMAIL,
				value: event.target.value
			});
		},
		updateCaptcha (key) {
			d.dispatch({
				type: c.LOGIN_UPDATE_CAPTCHA,
				value: key
			});
		},
		updateAccepted (event) {
			d.dispatch({
				type: c.LOGIN_UPDATE_ACCEPTED,
				value: event.target.checked
			});
		}
	}
};

export default actions;
