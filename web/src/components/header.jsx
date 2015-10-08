var React = require('react');

var Link = require('react-router').Link;

var actions = require('../actions/main');

var store = require('../stores/main');

var Header = React.createClass({
	getInitialState: store.getState,
	componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
	},
	componentWillUnmount: function componentWillUnmount () {
		store.removeChangeListener(this._onChange);
	},
	render: function render () {
		return (
			<nav className="ui inverted fixed menu">
				<Link to="dashboard" className="item">
					<i className="dashboard icon"></i> dashboard
				</Link>
				<Link to="app" params={{name: 'files'}} className="item">
					<i className="folder icon"></i> files
				</Link>
				<Link to="app" params={{name: 'gallery'}} className="item">
					<i className="photo icon"></i> gallery
				</Link>
				<Link to="app" params={{name: 'notes'}} className="item">
					<i className="edit icon"></i> notes
				</Link>
				<nav className="right menu">
					<a onClick={this.logout} className="item">
						<i className="sign out icon"></i> logout
					</a>
					<Link to="settings" className="item">
						<i className="settings icon"></i> settings
					</Link>
				</nav>
			</nav>
		);
	},
	logout: function logout () {
		actions.logout();
	},
	_onChange: function _onChange () {
		this.setState(store.getState());
	}
});

module.exports = {
	Header: Header
}
