export default class Login extends React.Component {

	render () {
		let {actions, state} = this.props;
		return (
			<main className="jumbotron custom-noradius">
				<div className="login">
					<form onSubmit={actions.send}>
						<h2>Login</h2>
						<fieldset className="form-group">
							<label for="registerName">Username</label>
							<input id="registerName" value={state.name} onChange={actions.updateName} type="text" name="name" className="form-control" placeholder="Username" required autofocus/>
						</fieldset>
						<fieldset className="form-group">
							<label for="registerPassword">Password</label>
							<input id="registerPassword" value={state.password} onChange={actions.updatePassword} type="password" name="password" className="form-control" placeholder="Password" required/>
						</fieldset>
						<button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
					</form>
				</div>
			</main>
		);
	}

}
