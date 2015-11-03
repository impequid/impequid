var React = require('react');

var store = require('../../stores/login.js');
var actions = require('../../actions');

var Component = React.createClass({
	getInitialState: store.getState,
	componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
	},
	componentWillUnmount: function componentWillUnmount () {
		store.removeChangeListener(this._onChange);
	},
	render: function render () {
		var loginButtonClasses = 'ui' + (this.state.loading ? ' loading' : '' ) + ' segment';
		var errorMessageClasses = 'ui' + (this.state.error ? ' visible' : '') + ' error message';
		return (
			<div className={loginButtonClasses}>
				<form className="ui form" onSubmit={actions.login}>
					<h3>
						<i className="sign in icon"></i> home cloud login
					</h3>
					<div className={errorMessageClasses}>
						Wrong username or password.
					</div>
					<div className="field">
						<div className="ui icon input" style={{width: '100%'}}>
							<input type="email" onChange={actions.changeEmail} value={this.state.email.data} placeholder="your email" required/>
							<i className="mail icon"></i>
						</div>
					</div>
					<div className="field">
						<div className="ui icon input" style={{width: '100%'}}>
							<input type="password" onChange={actions.changePassword} value={this.state.password.data} placeholder="password" required/>
							<i className="lock icon"></i>
						</div>
					</div>
					<button type="submit" className="ui primary fluid button" onClick={actions.login}>Login</button>
					<br/>
					Not signed up yet? <a href="#/login/register">Create an account.</a>
					<br/>
				</form>
			</div>
		);
	},
	_onChange: function _onChange () {
		this.setState(store.getState());
	}
});


module.exports = Component;
