// dependencies
var io = require('socket.io-client');
var sui = require('semantic-ui');
var React = require('react');
var Router = require('react-router');

// routes
var App = require('./app.jsx');
var AppLoader = require('./app-loader.jsx');

var Dashboard = require('./dashboard.jsx');
var Login = require('./login/login.jsx');
var Register = require('./login/register.jsx');
var LoginMain = require('./login/main.jsx');

var Settings = require('./settings.jsx');

// setup routes
var routes = (
	<Router.Route>
		<Router.Route name="main" path="/" handler={App}>
			<Router.DefaultRoute name="dashboard" handler={Dashboard}/>
			<Router.Route name="app" path="app/:name" handler={AppLoader}/>
			<Router.Route name="settings" path="settings" handler={Settings}/>
		</Router.Route>
		<Router.Route name="login" path="login" handler={Login}>
			<Router.Route name="register" handler={Register}/>
			<Router.DefaultRoute handler={LoginMain}/>
		</Router.Route>
	</Router.Route>
);

function renderRoute () {
	Router.run(routes, function (Handler) {
		React.render(<Handler/>, $('.full')[0]);
	});
}

$(document).ready(function () {
	var routeRendered;
	$('.dimmer').dimmer({
		closable: false
	});
	var url = location.protocol + '//' + location.host;
	console.log('trying to connect to ' + url);
	window.socket = io.connect(url, {
		reconnection: false
	});
	window.socket.on('connect', function () {
		$('.dimmer').dimmer('hide');
		console.info('socket connected');
		// verify login
		if (localStorage.impequidHasSession) {
			socket.emit('session:verify', function (err, data) {
				if (err) {
					console.info('not logged in');
					location.href = '#/login';
				} else {
					console.info('already logged in');
					if (location.href === '#/login' || location.href === '#/register') {
						location.href = '#/';
					}
				}
				if (!routeRendered) {
					routeRendered = true;
					renderRoute();
				}
			});
		} else {
			location.href = '#/login';
			if (!routeRendered) {
				routeRendered = true;
				renderRoute();
			}
		}
	});
	window.socket.on('disconnect', function () {
		$('.dimmer').dimmer('show');
		console.log('disconnected from ' + url);
		reconnect.attempt();
	});
});

var reconnect = {
	delay: 1500,
	attempt: function () {
		var url = location.protocol + '//' + location.host;
		var request = $.get(url, function (data) {
			socket.connect();
			reconnect.delay = 1500;
		});
		request.fail(function () {
			console.info('Reconnect failed, trying again in ' + reconnect.delay/1000 + ' seconds.');
			reconnect.delay += 500;
			reconnect.timeout = setTimeout(reconnect.attempt, reconnect.delay);
		});
	}
};
