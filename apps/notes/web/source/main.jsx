// require external
var React = require('react');
var Router = require('react-router');

var actions = require('./actions').main;

// require internal
var SpookySkeleton = require('./components/app.jsx');
var Viewer = require('./components/viewer.jsx');

// setup routes
var routes = (
	<Router.Route>
		<Router.Route name="main" path="/" handler={SpookySkeleton}>
			<Router.DefaultRoute name="viewer" handler={Viewer}/>
		</Router.Route>
	</Router.Route>
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
				actions.updateNotes();
				renderRoute();
			} else {
				$('.loader')[0].innerHTML = 'invalid token'
			}
        });
    });
});
