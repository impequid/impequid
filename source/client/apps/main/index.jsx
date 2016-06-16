// external
import {RouterMixin, navigate} from 'react-mini-router';

// internal
import actions from '../../actions/main';
import store from '../../stores/main';

// components
import Header from '../../components/header';
import Footer from '../../components/footer';
import Login from '../../components/login';
import Register from '../../components/register';
import About from '../../components/about';
import Dashboard from '../../components/dashboard';

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
				<Header state={this.state} actions={actions}/>
				{this.renderCurrentRoute()}
				<Footer/>
			</div>
		);
	},

	about () {
		isLoggedIn(false);
		return <About/>
	},

	login () {
		isLoggedIn(false);
		return (
			<Login actions={actions.login} state={this.state.login}/>
		);
	},

	register () {
		isLoggedIn(false);
		return (
			<Register actions={actions.login} state={this.state.login}/>
		)
	},

	dashboard () {
		isLoggedIn(true);
		return (
			<Dashboard/>
		);
	},

	onChange () {
		this.setState(store.getState());
	}

});

function isLoggedIn (loginOnly) {
	const loggedIn = store.getState().user.loggedIn;
	if (loginOnly !== loggedIn) navigate(loggedIn ? '/dashboard' : '/login');
}

window.onload = () => {
	actions.login.verify();
	ReactDOM.render(
		<App/>,
		document.getElementById('app')
	);
};
