var React = require('react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var Login = React.createClass({
	render: function render () {
		return (
			<main className="v-container">
				<div className="v-center-area">
					<div className="v-centered">
						<RouteHandler/>
					</div>
				</div>
			</main>
		);
	}
});

module.exports = Login;
