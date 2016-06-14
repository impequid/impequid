import App from './components/app.jsx';

window.onload = () => {
	window.socket = io.connect();
	window.socket.on('connect', () => {
		console.info('socket connected');
		ReactDOM.render(
			<App/>,
			document.getElementById('react')
		);
	});
};