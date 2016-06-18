import React from 'react';
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
							<label htmlFor="registerName">Username</label>
							<input id="registerName" value={state.name} onChange={actions.updateName} type="text" name="username" className="form-control" placeholder="Username" required autofocus/>
							<small className="text-muted">This may be shown publically.</small>
						</fieldset>
						<fieldset className="form-group">
							<label htmlFor="registerEmail">Email Address</label>
							<input id="registerEmail" value={state.email} onChange={actions.updateEmail} type="email" name="email" className="form-control" placeholder="Email Address" required/>
							<small className="text-muted">The Email is used for password recovery.</small>
						</fieldset>
						<fieldset className="form-group">
							<label htmlFor="registerPassword">Password</label>
							<input id="registerPassword" value={state.password} onChange={actions.updatePassword} type="password" name="password" className="form-control" placeholder="Password" required/>
							<br/>
							<input value={state.secondaryPassword} onChange={actions.updateSecondaryPassword} type="password" className="form-control" placeholder="Re-Type Password" required/>
							<small className="text-muted">Passwords are never stored <a target="_blank" href="https://en.wikipedia.org/wiki/Cryptographic_hash_function">unhashed</a> or <a target="_blank" href="https://en.wikipedia.org/wiki/Salt_(cryptography)">unsalted</a>.</small>
						</fieldset>
						<fieldset className="form-group">
							<label>Captcha</label><br/>
							<ReCaptcha verifyCallback={actions.updateCaptcha} sitekey={state.reCaptchaKey}/>
							<small className="text-muted">Unfortunately, impequid is not available for robots.</small>
						</fieldset>
						<fieldset className="form-group">
							<label htmlFor="registerCheckbox">Legal Stuff</label><br/>
							<input id="registerCheckbox" type="checkbox" onChange={actions.updateAccepted} checked={state.accepted} required/> I accept the <a href="https://github.com/dodekeract/impequid/tree/master/documentation/privacy-policy.md" target="_blank">Privacy Policy</a> and <a href="https://github.com/dodekeract/impequid/tree/master/documentation/terms-of-service.md" target="_blank">Terms Of Service</a><br/>
							<small className="text-muted">TLDR: Your data is used to make {state.name} work.</small>
						</fieldset>
						<button className="btn btn-lg btn-primary btn-block" type="submit">Create Free Account</button>
					</form>
				</div>
			</main>
		);
	}

}
