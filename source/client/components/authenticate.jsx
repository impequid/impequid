import React from 'react';

import Login from './login';
import Footer from './footer';

import actions from '../actions/login';
import store from '../stores/authenticate';

export default class Authenticate extends React.Component {

	constructor () {
		super();

		this.state = store.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount () {
		store.addChangeListener(this.onChange);
	}

	componentWillUnmount () {
		store.removeChangeListener(this.onChange);
	}

	render () {
		let key = 0;

		const main = this.state.login.valid ? (
			<main className="jumbotron custom-noradius">
				<div className="container">
					<h1>Welcome Back, {this.state.login.name}! <small className="text-muted" style={{fontSize: '20px'}}>Not you? <a href="/api/fallback/login" onClick={actions.logout}>logout</a></small></h1>
					<div className="alert alert-warning">
						<a href={this.state.app.url}>{this.state.app.name}</a> <small className="text-muted">by <a href={this.state.app.author.url}>{this.state.app.author.name}</a></small> is requesting the following permissions:
					</div>
					<ul className="list-group">{JSON.stringify(this.state.app.permissions)}</ul>
					<br/>
					<div className="btn-group" role="group" aria-label="Basic example">
						<a type="button" className="btn btn-success" href={'/api/main/authenticate/accept/' + this.state.app.token}>Allow Access</a>
						<a type="button" className="btn btn-danger" href={this.state.app.returnUrl.replace(':token', 'declined')}>Deny And Return To App</a>
					</div>
				</div>
			</main>
		) : (
			<main className="jumbotron custom-noradius">
				<div className="container">
					<h1>Sign in to authenticate {this.state.app.name}</h1>
					<div className="alert alert-warning">
						<a href={this.state.app.url}>{this.state.app.name}</a> <small className="text-muted">by <a href={this.state.app.author.url}>{this.state.app.author.name}</a></small> is requesting the following permissions:
					</div>
					<ul className="list-group">{JSON.stringify(this.state.app.permissions)}</ul>
					<Login state={this.state.login} actions={actions}/>
				</div>
			</main>
		);

		return (
			<div>
				{main}
				<Footer/>
			</div>
		);
	}

	onChange () {
		this.setState(store.getState());
	}

}
