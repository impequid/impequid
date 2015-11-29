var React = require('react');

var Link = require('react-router').Link;

var store = require('../stores');
var actions = require('../actions').main;

var Component = React.createClass({
	getInitialState: store.getState,
	componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
	},
	componentWillUnmount: function componentWillUnmount () {
		store.removeChangeListener(this._onChange);
	},
	render: function render () {
		var entries = [];
		for (var i = 0; i < this.state.entries.length; i++) {
			entries.push(
				<Entry data={this.state.entries[i]} key={i}/>
			);
		}
		return (
			<nav className="col span-3-of-12 custom-sidebar">
				<div className="ui basic segment">
					{entries}
				</div>
			</nav>
		);
	},
	_onChange: function _onChange () {
		this.setState(store.getState());
	}
});

var Entry = React.createClass({
	render: function render () {
		return (
			<div onClick={this.handleClick} className="item">
				{this.props.data.base}
			</div>
		);
	},
	handleClick: function handleClick () {
		actions.openNote(this.props.data.name);
	}
});

module.exports = Component;
