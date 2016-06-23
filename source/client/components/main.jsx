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
		'/dashboard': 'dashboard',
		'/profile': 'profile'
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
		this.isLoggedIn(false);
		return <About/>
	},

	login () {
		this.isLoggedIn(false);
		return (
			<Login actions={actions.login} state={this.state.login}/>
		);
	},

	register () {
		this.isLoggedIn(false);
		return (
			<Register actions={actions.login} state={this.state.login}/>
		)
	},

	dashboard () {
		this.isLoggedIn(true);
		return (
			<Dashboard state={this.state}/>
		);
	},

	profile () {
		return (
			<main>
				<div className="jumbotron">
					<div className="container">
						<h1>Profile</h1>
						soon
					</div>
				</div>
			</main>
		);
	},

	isLoggedIn (loginOnly) {
		setTimeout(() => {
			if (this.state.login.valid !== loginOnly) navigate(this.state.login.valid ? '/dashboard' : '/login');
		}, 0);
	},

	onChange () {
		this.setState(store.getState());
	}

});

export default App;
