var React = require('react');

var Link = require('react-router').Link;

var Menu = React.createClass({
	render: function render () {
		return (
			<nav className="ui visible inverted left vertical sidebar menu">
				<a className="item">
					<i className="home icon"></i>
					Home
				</a>
				<a className="item">
					<i className="block layout icon"></i>
					Topics
				</a>
				<a className="item">
					<i className="smile icon"></i>
					Friends
				</a>
				<a className="item">
					<i className="calendar icon"></i>
					History
				</a>
			</nav>
		);
	}
});

module.exports = Menu;
