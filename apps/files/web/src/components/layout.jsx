var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Menu = require('./menu.jsx');
var SideMenu = require('./side-menu.jsx');

var App = React.createClass({
	render: function render () {
		return (
			<div style={{overflow: 'hidden'}}>
				<Menu/>
				<div className="ui stackable grid">
					<SideMenu/>
					<RouteHandler/>
				</div>
			</div>
		);
		/*
		<div className="item">
			<div className="header" onClick={this.handleClick}>
				<i className="disk outline icon"></i>
				Root Directory
			</div>
			<div className="menu">Files</div>
		</div>
		<a className="item">
			<i className="share icon"></i>
			Shared Folders
		</a>
		*/
	}
});

module.exports = App;
