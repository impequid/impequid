import ReCaptcha from 'react-gcaptcha';

export default class Register extends React.Component {

	render () {
		const {actions, state} = this.props;
		return (
			<main className="jumbotron custom-noradius">
				<div className="register">
					<form onSubmit={actions.register}>
						<h2>Create An Account</h2>
						<fieldset className="form-group">
							<label for="registerName">Username</label>
							<input id="registerName" value={state.name} onChange={actions.updateName} type="text" name="name" className="form-control" placeholder="Username" required autofocus/>
							<small className="text-muted">This may be shown publically.</small>
						</fieldset>
						<fieldset className="form-group">
							<label for="registerEmail">Email Address</label>
							<input id="registerEmail" value={state.email} onChange={actions.updateEmail} type="email" name="email" className="form-control" placeholder="Email Address" required/>
							<small className="text-muted">The Email is used for password recovery.</small>
						</fieldset>
						<fieldset className="form-group">
							<label for="registerPassword">Password</label>
							<input id="registerPassword" value={state.password} onChange={actions.updatePassword} type="password" name="password" className="form-control" placeholder="Password" required/>
							<br/>
							<input value={state.secondaryPassword} onChange={actions.updateSecondaryPassword} type="password" className="form-control" placeholder="Re-Type Password" required/>
							<small className="text-muted">Passwords are never stored <a target="_blank" href="https://en.wikipedia.org/wiki/Cryptographic_hash_function">unhashed</a> or <a target="_blank" href="https://en.wikipedia.org/wiki/Salt_(cryptography)">unsalted</a>.</small>
						</fieldset>
						<fieldset className="form-group">
							<label for="registerCheckbox">Legal Stuff</label><br/>
							<input id="registerCheckbox" type="checkbox" onChange={actions.updateAccepted} checked={state.accepted} required/> I accept the <a href="/privacy" target="_blank">Privacy Policy</a> and <a href="/terms-of-service" target="_blank">Terms Of Service</a><br/>
							<small className="text-muted">TLDR: Your data is used to make impequid work.</small>
						</fieldset>
						<ReCaptcha verifyCallback={actions.updateCaptcha} sitekey=""/>
						<small className="text-muted">Unfortunately, impequid is not available for robots.</small>
						<button className="btn btn-lg btn-primary btn-block" type="submit">Create Account</button>
					</form>
				</div>
			</main>
		);
	}

}
