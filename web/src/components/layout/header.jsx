var React = require('react');

var Link = require('react-router').Link;

var Header = React.createClass({
	logout: function logout () {
		window.socket.emit('session:logout', function (err, data) {
			if (!err) {
				delete localStorage.impequidHasSession;
				location.href = '#/login';
			}
		});
	},
	openSidebar: function openSidebar () {
		$('.sidebar').sidebar('show');
	},
	render: function render () {
		return (
			<nav className="ui inverted fixed menu">
				<Link to="dashboard" className="item">
					<i className="dashboard icon"></i> dashboard
				</Link>
				<Link to="app" params={{name: 'notes'}} className="item">
					<i className="edit icon"></i> notes
				</Link>
				<Link to="app" params={{name: 'files'}} className="item">
					<i className="folder icon"></i> files
				</Link>
				<nav className="right menu">
					<a onClick={this.logout} className="item">
						<i className="sign out icon"></i> logout
					</a>
					<a onClick={this.openSidebar} className="item">
						<i className="settings icon"></i> settings
					</a>
				</nav>
			</nav>
		);
	}
});

module.exports = {
	Header: Header
}
