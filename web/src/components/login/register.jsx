var React = require('react');

var Register = React.createClass({
	getInitialState: function getInitialState () {
		return {
			step: 0,
			username: '',
			password: '',
			email: ''
		}
	},
	nextStep: function nextStep (e) {
		e.preventDefault();
		if (this.state.step < 2) {
			// check if current step is valid
			if (this.state.step === 0) {
				if (this.isValid('email') && this.isValid('password')) {
					this.setState({
						step: this.state.step + 1,
						showErrors: false
					});
				} else {
					this.setState({
						showErrors: true
					});
				}
			} else {
				if (this.isValid('username')) {
					this.setState({
						step: this.state.step + 1,
						showErrors: false
					});
				} else {
					this.setState({
						showErrors: true
					});
				}
			}
		}
	},
	isValid: function isValid (key) {
		switch (key) {
			case 'email':
				var regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
				return regex.test(this.state.email);
			break;
			case 'username':
				return this.state.username.length >= 4;
			break;
			case 'password':
				return this.state.password.length >= 8;
			break;
			default:
				return this.state.email.length > 0 && this.state.username.length > 0 && this.state.password.length >= 8;
		}
	},
	previousStep: function previousStep () {
		if (this.state.step > 0) {
			this.setState({
				step: this.state.step - 1,
				showErrors: false
			});
		}
	},
	register: function register (e) {
		var that = this;
		e.preventDefault();
		window.socket.emit('session:register', {
			email: that.state.email,
			password: that.state.password,
			username: that.state.username,
			secret: prompt('Secret?')
		}, function (err, data) {
			if (!err) {
				socket.emit('login', {
					email: that.state.email,
					password: that.state.password
				}, function (err, data) {
					if (!err) {
						localStorage.hasSession = true;
						location.href = '#/';
					} else {
						alert('login failed');
					}
				});
			} else {
				alert('registration failed')
			}
		});
	},
	change: function change (key, event) {
		var nextState = {}
		nextState[key] = event.target.value
		this.setState(nextState);
	},
	changeUsername: function changeUsername (event) {
		this.change('username', event);
	},
	changePassword: function changePassword (event) {
		this.change('password', event);
	},
	changeEmail: function changeEmail (event) {
		this.change('email', event);
	},
	renderSteps: function renderSteps () {
		var stepClasses = [
			'step',
			'step',
			'step'
		];
		// assign classes
		for (var i = 0; i < 3; i++) {
			if (i === 0 && this.isValid('email') && this.isValid('password')) {
				stepClasses[i] += ' completed';
			} else if (i === 1 && this.isValid('username')) {
				stepClasses[i] += ' completed';
			}
			if (i === this.state.step) {
				stepClasses[i] += ' active';
			}
		}
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
				if (this.isValid('email') && this.isValid('password')) {
					nextButtonClasses += ' positive';
				}
				backButton = (<a href="#/login" className="ui negative button">Cancel</a>);
				nextButton = (<input type="submit" className={nextButtonClasses} value="Next"/>);
			break;
			case 1:
				if (this.isValid('username')) {
					nextButtonClasses += ' positive';
				}
				backButton = (<div className="ui button" onClick={this.previousStep}>Back</div>);
				nextButton = (<input type="submit" className={nextButtonClasses} value="Next"/>);
			break;
			case 2:
				if (!this.isValid()) {
					nextButtonClasses += ' disabled';
				} else {
					nextButtonClasses += ' positive';
				}
				backButton = (<div className="ui button" onClick={this.previousStep}>Back</div>);
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
				var emailClasses = 'field';
				if (this.state.showErrors && !this.isValid('email')) {
					emailClasses += ' error';
				}
				var passwordClasses = 'field';
				if (this.state.showErrors && !this.isValid('password')) {
					passwordClasses += ' error';
				}
				var errorMessage, emailError, passwordError;
				if (this.state.showErrors) {
					if (!this.isValid('email')) {
						emailError = (<p>Invalid E-Mail Address.</p>);
					}
					if (!this.isValid('password')) {
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
					<form className="ui form" onSubmit={this.nextStep} autocomplete="off">
						{errorMessage}
						<div className={emailClasses}>
							<label>E-Mail</label>
							<div className="ui icon input">
								<input type="email" placeholder="your@e-mail.tld" value={this.state.email} onChange={this.changeEmail} required/>
								<i className="mail icon"></i>
							</div>
						</div>
						<div className={passwordClasses}>
							<label>Password</label>
							<div className="ui icon input">
								<input type="password" value={this.state.password} onChange={this.changePassword} required/>
								<i className="lock icon"></i>
							</div>
						</div>
						{this.renderButtons()}
					</form>
				);
			break;
			case 1:
				var usernameClasses = 'field';
				if (this.state.showErrors && !this.isValid('username')) {
					usernameClasses += ' error';
				}
				var errorMessage, usernameError;
				if (this.state.showErrors && !this.isValid('username')) {
					errorMessage = (
						<div className="ui visible error message">
							<p>Your username is too short.</p>
						</div>
					);
				}
				return (
					<form className="ui form" onSubmit={this.nextStep} autocomplete="off">
						{errorMessage}
						<div className={usernameClasses}>
							<label>Username</label>
							<div className="ui icon input">
								<input type="text" placeholder="username" value={this.state.username} onChange={this.changeUsername} required/>
								<i className="user icon"></i>
							</div>
						</div>
						{this.renderButtons()}
					</form>
				);
			break;
			case 2:
				return (
					<form onSubmit={this.register} autocomplete="off">
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
									<td>{this.state.username}</td>
								</tr>
								<tr className="center aligned">
									<td><i className="mail icon"></i> Email</td>
									<td>{this.state.email}</td>
								</tr>
								<tr>
									<td><i className="lock icon"></i> Password</td>
									<td>{this.state.password.length} Characters</td>
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
	}
});

module.exports = Register;
