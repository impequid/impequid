var React = require('react');

var store = require('../stores');

var Component = React.createClass({
	getInitialState: store.getViewerState,
	componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
	},
	componentWillUnmount: function componentWillUnmount () {
		store.removeChangeListener(this._onChange);
	},
	render: function render () {
		return (
			<main className="custom-content">
				<div className="ui basic segment">
					<h1>{this.state.title}</h1>
					{this.state.content}
				</div>
			</main>
		);
	},
	_onChange: function _onChange () {
		this.setState(store.getViewerState());
	}
});

module.exports = Component;
