// dependencies
var React = require('react');
var Router = require('react-router');

var actions = require('../actions/main');

// routes
var App = require('./app.jsx');
var AppLoader = require('./app-loader.jsx');

var Dashboard = require('./dashboard.jsx');
var Login = require('./login/layout.jsx');
var Register = require('./login/register.jsx');
var LoginMain = require('./login/login.jsx');

var Settings = require('./settings.jsx');

// activate stores
var notificationStore = require('../stores/notification.js');

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

window.renderRoute = function renderRoute () {
	Router.run(routes, function (Handler) {
		React.render(<Handler/>, $('.full')[0]);
	});
};

$(document).ready(function () {
	$('.dimmer').dimmer({
		closable: false
	});
	actions.connect();
});
