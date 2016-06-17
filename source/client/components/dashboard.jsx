import React from 'react';

import Apps from './apps';

export default class Main extends React.Component {

	render () {
		const {actions, state} = this.props;

		return (
			<main>
				<div className="jumbotron custom-noradius">
					<div className="container">
						<h1>Your Apps</h1>
					</div>
				</div>
				<Apps actions={actions} state={state.apps}/>
			</main>
		);
	}

}
