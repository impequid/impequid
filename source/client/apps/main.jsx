import ReactDOM from 'react-dom';
import App from '../components/main';
import actions from '../actions/main';

window.onload = () => {
	actions.hydrate(window.INITIAL_STATE);

	ReactDOM.render(
		<App history={true}/>,
		document.getElementById('app')
	);
};
