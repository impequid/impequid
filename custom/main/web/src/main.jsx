var React = require('react');
var Router = require('react-router');

var Layout = require('./components/layout.jsx');
var Content = require('./components/content.jsx');

var actions = require('./actions');

var routes = (
	<Router.Route name="main" path="/" handler={Layout}>
		<Router.DefaultRoute name="content" handler={Content}/>
	</Router.Route>
);

function renderRoutes () {
	Router.run(routes, function (Handler) {
		React.render(<Handler/>, $('body')[0]);
	});
}

$(document).ready(function () {
	renderRoutes();
	actions.connect();
});
