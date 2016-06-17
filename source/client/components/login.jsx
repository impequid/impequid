import React from 'react';

import actions from '../actions/login';

export default class Login extends React.Component {

	constructor () {
		super();
	}

	componentDidMount () {
		// fix autofill not firing events
		const {state} = this.props;
		const name = document.getElementById('registerName').value;
		const password = document.getElementById('registerPassword').value;
		if (name !== state.name || password !== state.password) {
			actions.fixAutofill(name, password);
		}
	}

	render () {
		const {actions, state} = this.props;
		return (
			<main className="jumbotron custom-noradius">
				<div className="login">
					<form onSubmit={actions.send} method="post" action="/api/fallback/login">
						<h2>Login</h2>
						<fieldset className="form-group">
							<label htmlFor="registerName">Username</label>
							<input id="registerName" value={state.name} onChange={actions.updateName} type="text" name="name" className="form-control" placeholder="Username" required autofocus/>
						</fieldset>
						<fieldset className="form-group">
							<label htmlFor="registerPassword">Password</label>
							<input id="registerPassword" value={state.password} onChange={actions.updatePassword} type="password" name="password" className="form-control" placeholder="Password" required/>
						</fieldset>
						<button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
						<br/>
						<small>Not signed up yet? <a href="/register">Register here for free</a>.</small>
					</form>
				</div>
			</main>
		);
	}

}
