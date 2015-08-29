// dependencies
var io = require('socket.io-client');
var Router = require('react-router');
var React = require('react');
var sui = require('semantic-ui');

// api
var api = require('./api/');

// routes
var App = require('./app.jsx');

var Dashboard = require('./dashboard.jsx');
var Login = require('./login/login.jsx');
var Register = require('./login/register.jsx');
var LoginMain = require('./login/main.jsx');

var Header = require('./layout/header.jsx');

// alias
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// setup routes
var routes = (
	<Route>
		<Route name="main" path="/" handler={App}>
			<DefaultRoute name="dashboard" handler={Dashboard}/>
		</Route>
		<Route name="login" path="/login" handler={Login}>
			<Route name="register" handler={Register}/>
			<DefaultRoute handler={LoginMain}/>
		</Route>
	</Route>
);

function renderRoute () {
	Router.run(routes, function (Handler) {
		React.render(<Handler/>, $('.pusher')[0]);
	});
}

$(document).ready(function () {
	renderRoute();
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
		Header.setSocket(socket);
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
					location.href = '#/';
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
		reconnect.attempt();
	});
});

var reconnect = {
	delay: 1500,
	attempt: function () {
		var url = location.protocol + '//' + location.host + location.pathname;
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
}
