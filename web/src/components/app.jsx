var React = require('react');

var Header = require('./layout/header.jsx').Header;

var Footer = require('./layout/footer.jsx');

var RouteHandler = require('react-router').RouteHandler;

var App = React.createClass({
	render: function render () {
		return (
			<div id="fuck-react">
				<Header/>
				<div style={{marginTop: 60 + 'px', marginBottom: 60 + 'px'}}>
					<RouteHandler/>
				</div>
				<Footer/>
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
