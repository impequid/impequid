var React = require('react');

var Dashboard = React.createClass({
	getInitialState: function () {
		return {
			token: 'none'
		}
	},
	getToken: function () {
		var that = this;
		window.socket.emit('token:create', 'files', function (err, token) {
			if (!err) that.setState({
				token: token
			});
		});
	},
	render: function render () {
		return (
			<main className="column">
				<div className="ui action input">
					<input type="text" value={this.state.token} readOnly={true} />
					<button className="ui button" onClick={this.getToken}>Get Files Token</button>
				</div>
			</main>
		);
	}
});

module.exports = Dashboard;
