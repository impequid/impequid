// require external
var React = require('react');
var Router = require('react-router');

// require internal
var SpookySkeleton = require('./components/layout.jsx');
var Content = require('./components/content.jsx');

window.store = require('./stores');
var actions = require('./actions');

// alias
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// setup routes
var routes = (
	<Route name="main" path="/" handler={SpookySkeleton}>
		<DefaultRoute name="content" handler={Content}/>
	</Route>
);

function renderRoute () {
	Router.run(routes, function (Handler) {
		React.render(<Handler/>, $('body')[0]);
	});
}

// get token from url
window.getParameterByName = function (name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var urlToken = window.getParameterByName('token');

$(document).ready(function () {
    window.socket = io.connect();
    window.socket.on('connect', function () {
        console.log('connected');
        urlToken = urlToken || prompt('Token?');
        console.log('digesting provided token', urlToken);
        window.socket.emit('token:digest', urlToken, function (err, data) {
			console.log('token:digest', err, data);
			if (!err) {
				actions.updateFolder();
				renderRoute();
			} else {
				$('.loader')[0].innerHTML = 'invalid token'
			}
        });
    });
});

window.fancyFileSize = function fancyFileSize (size, precision) {
    if (size === 0) return 'empty';

    var names = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
        i = -1;

    while (Math.pow(1024, i+1) <= size) {i++;}

    var unit = Math.pow(1024, i),
        prec = Math.pow(10, precision);

    return (Math.round((size*prec)/unit)/prec + ' ' + names[i]);
}

window.generateUUID = function () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = 16 * Math.random() | 0;
		return ('x' === c ? r : r & 3 | 8).toString(16);
	});
}
