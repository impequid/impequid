import React from 'react';
import {navigate} from 'react-mini-router';

export default class Header extends React.Component {

	render () {
		const {state, actions, active} = this.props;

		const activeRoute = (route) => {
			return route === active ? ' active' : '';
		};

		const leftEntries = [];
		const rightEntries = [];
		let leftKey = 0;
		let rightKey = 0;

		if (state.valid) {
			leftEntries.push(
				<li key={leftKey++} className={"nav-item" + activeRoute('/dashboard')}>
					<a className="nav-link" href="/dashboard">Dashboard</a>
				</li>
			);
			rightEntries.push(
				<li key={rightKey++} className="nav-item">
					<a className="nav-link" href="/api/fallback/login" onClick={actions.logout}>Logout</a>
				</li>
			);
			rightEntries.push(
				<li key={rightKey++} className={"nav-item" + activeRoute('/profile')}>
					<a className="nav-link" href="/profile">{state.name}</a>
				</li>
			);
		} else {
			leftEntries.push(
				<li key={leftKey++} className={"nav-item" + activeRoute('/')}>
					<a className="nav-link" href="/">About</a>
				</li>
			);
			leftEntries.push(
				<li key={leftKey++} className={"nav-item" + activeRoute('/register')}>
					<a className="nav-link" href="/register">Register</a>
				</li>
			);
			rightEntries.push(
				<li key={rightKey++} className={"nav-item" + activeRoute('/login')}>
					<a className="nav-link" href="/login">Login</a>
				</li>
			);
		}

		return (
			<header className="navbar navbar-static-top navbar-dark bg-inverse custom-noradius">
				<div className="container">
					<a className="navbar-brand">impequid</a>
					<ul className="nav navbar-nav">
						{leftEntries}
					</ul>
					<ul className="nav navbar-nav pull-xs-right">
						{rightEntries}
					</ul>
				</div>
			</header>
		);
	}

}
