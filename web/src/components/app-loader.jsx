var React = require('react');

var store = require('../stores');
var actions = require('../actions');

var Component = React.createClass({
	getInitialState: store.application.getState,
	componentDidMount: function componentDidMount () {
		this._update(this.props.params.name);
		store.application.addChangeListener(this._onChange);
	},
	componentWillReceiveProps: function (nextProps) {
		this._update(nextProps.params.name);
	},
	componentWillUnmount: function componentWillUnmount () {
		store.application.removeChangeListener(this._onChange);
	},
	render: function render () {
		if (this.state.loading) {
			return (
				<div className="ui active inverted dimmer">
					<div className="ui large indeterminate text loader">loading {this.state.name}</div>
				</div>
			);
		} else if (this.state.token) {
			return (<iframe className="application" src={'https://' + this.state.name + '.' + this.state.host + ':' + this.state.port + '?token=' + this.state.token}></iframe>);
		} else {
			return (<div>error creating token</div>);
		}
	},
	_update: function _update (name) {
		actions.updateApplication(name);
	},
	_onChange: function _onChange () {
		this.setState(store.application.getState());
	}
});

module.exports = Component;
