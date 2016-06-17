import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/authenticate';

import actions from '../actions/authenticate';

window.onload = () => {
	actions.hydrate(window.INITIAL_STATE);

	ReactDOM.render(<App/>, document.getElementById('app'));
};
