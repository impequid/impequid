var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Menu = require('./menu.jsx');

var App = React.createClass({
	render: function render () {
		return (
			<div id="fuck-react" className="ui bottom attached segment pushable">
				<Menu/>
				<div className="pusher">
					<div className="ui basic segment">
						<RouteHandler/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = App;
