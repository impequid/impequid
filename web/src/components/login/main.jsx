var React = require('react');

var LoginMain = React.createClass({
	getInitialState: function getInitialState () {
		return {
			email: '',
			password: '',
			loginButtonClasses: 'ui segment'
		}
	},
	login: function login (e) {
		var that = this;
		e.preventDefault();
		this.setState({
			loginButtonClasses: 'ui loading segment'
		});
		window.socket.emit('session:login', {
			email: that.state.email,
			password: that.state.password
		}, function (err, data) {
			if (!err) {
				localStorage.impequidHasSession = true;
				location.href = '#/';
			} else {
				that.setState({
					loginButtonClasses: 'ui segment'
				});
				alert('login failed');
			}
		})
	},
	change: function change (key, event) {
		var nextState = {}
		nextState[key] = event.target.value
	},
	changePassword: function changePassword (event) {
		this.setState({'password': event.target.value});
	},
	changeEmail: function changeEmail (event) {
		this.setState({'email': event.target.value});
	},
	render: function render () {
		return (
			<div className={this.state.loginButtonClasses}>
				<form className="ui form" onSubmit={this.login}>
					<h3>
						<i className="sign in icon"></i> home cloud login
					</h3>
					<div className="field">
						<div className="ui icon input" style={{width: '100%'}}>
							<input type="email" onChange={this.changeEmail} placeholder="your email" required/>
							<i className="mail icon"></i>
						</div>
					</div>
					<div className="field">
						<div className="ui icon input" style={{width: '100%'}}>
							<input type="password" onChange={this.changePassword} placeholder="password" required/>
							<i className="lock icon"></i>
						</div>
					</div>
					<button type="submit" className="ui primary fluid button" onClick={this.login}>Login</button>
					<br/>
					Not signed up yet? <a href="#/login/register">Create an account.</a>
					<br/>
				</form>
			</div>
		);
	}
});


module.exports = LoginMain;
