var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Menu = require('./menu.jsx');

var App = React.createClass({
	render: function render () {
		return (
			<div id="fuck-react">
				<Menu/>
				<div style={{marginTop: 60 + 'px'}}>
					<RouteHandler/>
				</div>
			</div>
		);
	}
});

module.exports = App;
