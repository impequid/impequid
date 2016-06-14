import {RouterMixin} from 'react-mini-router';

import Login from './login.jsx';

const App = React.createClass({
	mixins: [RouterMixin],
	
	routes: {
		'/': 'main'
	},
	
	render: function () {
    	return (
    		<div>
    			{this.renderCurrentRoute()}
    		</div>
    	);
	},
	
	main: function () {
    	return (
    		<div>
				main
				<Login/>
    		</div>
    	);
	}
});