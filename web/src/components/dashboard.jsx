var React = require('react');

var Dashboard = React.createClass({
	getInitialState: function () {
		return {
			token: 'none'
		}
	},
	getToken: function () {
		var that = this;
		var appName = prompt('App name?', 'notes');
		window.socket.emit('token:create', appName, function (err, token) {
			if (!err) that.setState({
				token: token
			});
		});
	},
	render: function render () {
		return (
			<main className="column">
				<button className="ui button" onClick={this.getToken}>get token</button>{this.state.token}
			</main>
		);
	}
});

module.exports = Dashboard;
