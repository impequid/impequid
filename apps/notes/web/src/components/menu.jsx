var React = require('react');

var Link = require('react-router').Link;

var Menu = React.createClass({
	render: function render () {
		return (
			<nav className="ui inverted fixed menu">
				<Link to="dashboard" className="item">
					<i className="dashboard icon"></i> all notes
				</Link>
			</nav>
		);
	}
});

module.exports = Menu;
