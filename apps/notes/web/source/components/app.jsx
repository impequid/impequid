var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var SideBar = require('./sidebar.jsx');
var Menu = require('./menu.jsx');

var App = React.createClass({
	render: function render () {
		return (
			<div>
				<Menu/>
				<div>
					<SideBar/>
					<RouteHandler/>
				</div>
			</div>
		);
	}
});

module.exports = App;
