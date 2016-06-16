import {navigate} from 'react-mini-router';

export default class Header extends React.Component {

	render () {
		const {state, actions} = this.props;

		const leftEntries = [];
		const rightEntries = [];
		let leftKey = 0;
		let rightKey = 0;

		if (state.user.loggedIn) {
			leftEntries.push(
				<li key={leftKey++} className="nav-item">
					<a className="nav-link" onClick={navigate.bind(this, '/dashboard')}>Dashboard</a>
				</li>
			);
			rightEntries.push(
				<li key={rightKey++} className="nav-item">
					<a className="nav-link" onClick={actions.logout}>Logout</a>
				</li>
			);
			rightEntries.push(
				<li key={rightKey++} className="nav-item">
					<a className="nav-link" onClick={navigate.bind(this, '/profile')}>{state.user.name}</a>
				</li>
			);
		} else {
			leftEntries.push(
				<li key={leftKey++} className="nav-item">
					<a className="nav-link" onClick={navigate.bind(this, '/')}>About</a>
				</li>
			);
			leftEntries.push(
				<li key={leftKey++} className="nav-item">
					<a className="nav-link" onClick={navigate.bind(this, '/register')}>Register</a>
				</li>
			);
			leftEntries.push(
				<li key={leftKey++} className="nav-item">
					<a className="nav-link" onClick={navigate.bind(this, '/login')}>Login</a>
				</li>
			);
		}

		return (
			<header className="navbar navbar-static-top navbar-dark bg-inverse custom-noradius">
				<div className="container">
					<a onClick={navigate.bind(this, '/')} className="navbar-brand">impequid</a>
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
