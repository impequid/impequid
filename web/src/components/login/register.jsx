var React = require('react');

var store = require('../../stores/login.js');
var actions = require('../../actions');

var Component = React.createClass({
	getInitialState: store.getState,
	componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
	},
	componentWillUnmount: function componentWillUpdate () {
		store.removeChangeListener(this._onChange);
	},
	renderSteps: function renderSteps () {
		var stepClasses = [];

		for (var i = 0; i < 3; i++) {
			stepClasses.push(this.state.steps[i].valid ? 'completed step':'step');
		}

		stepClasses[this.state.step] += ' active';

		return (
			<div className="ui small steps">
				<div className={stepClasses[0]}>
					<i className="sign in icon"></i>
					<div className="content">
						<div className="title">Login Data</div>
					</div>
				</div>
				<div className={stepClasses[1]}>
					<i className="user icon"></i>
					<div className="content">
						<div className="title">Username</div>
					</div>
				</div>
				<div className={stepClasses[2]}>
					<i className="info icon"></i>
					<div className="content">
						<div className="title">Confirm</div>
					</div>
				</div>
			</div>
		);
	},
	renderButtons: function renderButtons () {
		var backButton, nextButton;
		var nextButtonClasses = 'ui button';
		switch (this.state.step) {
			case 0:
				if (this.state.steps[0].valid) {
					nextButtonClasses += ' positive';
				}

				backButton = (<a href="#/login" className="ui negative button">Cancel</a>);
				nextButton = (<input type="submit" className={nextButtonClasses} value="Next"/>);
			break;
			case 1:
				if (this.state.steps[0].valid) {
					nextButtonClasses += ' positive';
				}

				backButton = (<div className="ui button" onClick={actions.stepBack}>Back</div>);
				nextButton = (<input type="submit" className={nextButtonClasses} value="Next"/>);
			break;
			case 2:
				if (this.state.allValid) {
					nextButtonClasses += ' positive';
				} else {
					nextButtonClasses += ' disabled';
				}
				backButton = (<div className="ui button" onClick={actions.stepBack}>Back</div>);
				nextButton = (<input type="submit" className={nextButtonClasses} value="Register"/>);
			break;
		}
		return (
			<div className="ui three wide centered grid">
				<div className="two columns" style={{padding: 20 + 'px'}}>
					<div className="ui buttons">
						{backButton}
						<div className="or"></div>
						{nextButton}
					</div>
				</div>
			</div>
		);
	},
	renderStepContent: function renderStepContent () {
		switch (this.state.step) {
			case 0:
				var emailClasses = 'field',
					passwordClasses = 'field';
				var errorMessage, emailError, passwordError;
				if (this.state.showErrors) {
					if (!this.state.email.valid) {
						emailClasses += ' error';
						emailError = (<p>Invalid E-Mail Address.</p>);
					}
					if (!this.state.password.valid) {
						passwordClasses += ' error';
						passwordError = (<p>Your Password is too short.</p>);
					}
					if (emailError || passwordError) {
						errorMessage = (
							<div className="ui visible error message">
								{emailError}
								{passwordError}
							</div>
						);
					}
				}
				return (
					<form className="ui form" onSubmit={actions.stepForward} autoComplete="off">
						{errorMessage}
						<div className={emailClasses}>
							<label>E-Mail</label>
							<div className="ui icon input" style={{width: '100%'}}>
								<input type="email" placeholder="your@e-mail.tld" value={this.state.email.data} onChange={actions.changeEmail} required/>
								<i className="mail icon"></i>
							</div>
						</div>
						<div className={passwordClasses}>
							<label>Password</label>
							<div className="ui icon input" style={{width: '100%'}}>
								<input type="password" value={this.state.password.data} onChange={actions.changePassword} required/>
								<i className="lock icon"></i>
							</div>
						</div>
						{this.renderButtons()}
					</form>
				);
			break;
			case 1:
				var usernameClasses = 'field';
				var errorMessage, usernameError;

				if (this.state.showErrors && !this.state.username.valid) {
					usernameClasses += ' error';
					errorMessage = (
						<div className="ui visible error message">
							<p>Your username is too short.</p>
						</div>
					);
				}

				return (
					<form className="ui form" onSubmit={actions.stepForward} autoComplete="off">
						{errorMessage}
						<div className={usernameClasses}>
							<label>Username</label>
							<div className="ui icon input" style={{width: '100%'}}>
								<input type="text" placeholder="username" value={this.state.username.data} onChange={actions.changeUsername} required/>
								<i className="user icon"></i>
							</div>
						</div>
						{this.renderButtons()}
					</form>
				);
			break;
			case 2:
				return (
					<form onSubmit={actions.register} autoComplete="off">
						<table className="ui unstackable table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Value</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><i className="user icon"></i> Username</td>
									<td>{this.state.username.data}</td>
								</tr>
								<tr>
									<td><i className="mail icon"></i> Email</td>
									<td>{this.state.email.data}</td>
								</tr>
								<tr>
									<td><i className="lock icon"></i> Password</td>
									<td>{this.state.password.data.length} Characters</td>
								</tr>
							</tbody>
						</table>
						{this.renderButtons()}
					</form>
				);
			break;
		}
	},
	render: function render () {
		return (
			<div className="ui segment">
				{this.renderSteps()}
				<br/>
				{this.renderStepContent()}
			</div>
		);
	},
	_onChange: function _onChange () {
		this.setState(store.getState());
	}
});

module.exports = Component;
