// require external
var React = require('react');
var Router = require('react-router');

// require internal
var SpookySkelton = require('./layout.jsx');
var Content = require('./content.jsx');

// alias
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// setup routes
var routes = (
	<Route name="main" path="/" handler={SpookySkelton}>
		<DefaultRoute name="content" handler={Content}/>
	</Route>
);

function renderRoute () {
	Router.run(routes, function (Handler) {
		React.render(<Handler/>, $('body')[0]);
	});
}

// get token from url
function getParameterByName (name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var urlToken = getParameterByName('token');

$(document).ready(function () {
    window.socket = io.connect();
    window.socket.on('connect', function () {
        console.log('connected');
        urlToken = urlToken || prompt('Token?');
        console.log('digesting provided token', urlToken);
        window.socket.emit('token:digest', urlToken, function (err, data) {
			console.log('token:digest', err, data);
			if (!err) {
				renderRoute();
			} else {
				$('.loader')[0].innerHTML = 'invalid token'
			}
        });
    });
});
