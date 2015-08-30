// require external
var React = require('react');
var Router = require('react-router');

// require internal
var SpookySkelton = require('./app.jsx');

// alias
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Dashboard = React.createClass({
	getInitialState: function () {
		return {
			user: '',
            token: ''
		}
	},
	getUser: function () {
		var that = this;
		window.socket.emit('user:get', function (err, user) {
            console.log('user:get', err, user);
			if (!err) that.setState({
				user: user
			});
		});
	},
	digest: function () {
        var that = this;
		window.socket.emit('token:digest', this.state.token, function (err, data) {
			console.log(err, data);
            that.setState({
                token: ''
            });
		});
	},
    change: function change (event) {
		var nextState = {}
		nextState['token'] = event.target.value
		this.setState(nextState);
	},
	render: function render () {
		return (
			<main className="column">
                <div className="ui action input">
                    <input type="text" onChange={this.change} placeholder="none" value={this.state.token} />
                    <button className="ui button" onClick={this.digest}>Digest Token</button>
                </div>
				<div className="ui action input">
					<input type="text" placeholder="none" value={this.state.user} readOnly={true} />
					<button className="ui button" onClick={this.getUser}>Get User</button>
				</div>
			</main>
		);
	}
});

// setup routes
var routes = (
	<Route>
		<Route name="main" path="/" handler={SpookySkelton}>
			<DefaultRoute name="dashboard" handler={Dashboard}/>
		</Route>
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
	renderRoute();
    window.socket = io.connect();
    window.socket.on('connect', function () {
        console.log('connected');
        if (urlToken) {
            console.log('token', urlToken);
            window.socket.emit('token:digest', urlToken, function (err, data) {
                console.log('token:digest', err, data);
            });
        }
    });
});
