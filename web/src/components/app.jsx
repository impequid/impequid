var React = require('react');

var Header = require('./header.jsx').Header;

var RouteHandler = require('react-router').RouteHandler;

var App = React.createClass({
	render: function render () {
		return (
			<div id="fuck-react">
				<Header/>
				<div className="application">
					<RouteHandler/>
				</div>
			</div>
		);
	},
	componentDidMount: function componentDidMount () {
		$('.sidebar')
			.sidebar()
		;
	}
});

module.exports = App;
