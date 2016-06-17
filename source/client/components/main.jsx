// external
import React from 'react';
import {RouterMixin, navigate} from 'react-mini-router';

// internal
import actions from '../actions/main';
import store from '../stores/main';

// components
import Header from '../components/header';
import Footer from '../components/footer';
import Login from '../components/login';
import Register from '../components/register';
import About from '../components/about';
import Dashboard from '../components/dashboard';

const App = React.createClass({
	mixins: [RouterMixin],

	routes: {
		'/': 'about',
		'/register': 'register',
		'/login': 'login',
		'/dashboard': 'dashboard'
	},

	getInitialState: store.getState,

	componentDidMount () {
		store.addChangeListener(this.onChange);
	},

	componentWillUnmount () {
		store.removeChangeListener(this.onChange);
	},

	render () {
		return (
			<div>
				<Header active={this.state.path} state={this.state.login} actions={actions.login}/>
				{this.renderCurrentRoute()}
				<Footer/>
			</div>
		);
	},

	about () {
		isLoggedIn(this.state.login.valid, false);
		return <About/>
	},

	login () {
		isLoggedIn(this.state.login.valid, false);
		return (
			<Login actions={actions.login} state={this.state.login}/>
		);
	},

	register () {
		isLoggedIn(this.state.login.valid, false);
		return (
			<Register actions={actions.login} state={this.state.login}/>
		)
	},

	dashboard () {
		isLoggedIn(this.state.login.valid, true);
		return (
			<Dashboard state={this.state}/>
		);
	},

	onChange () {
		this.setState(store.getState());
	}

});

function isLoggedIn (loggedIn, loginOnly) {
	setTimeout(() => {
		if (loginOnly !== loggedIn) navigate(loggedIn ? '/dashboard' : '/login');
	}, 0);
}

export default App;
