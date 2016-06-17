import React from 'react';

export default class Apps extends React.Component {

	render () {
		const {actions, state} = this.props;

		const appList = [];

		state.forEach((app, index) => {
			appList.push(
				<App key={index} state={app}/>
			);
		});

		return (
			<div className="container">
				<div className="card-columns text-xs-center">
					{appList}
				</div>
			</div>
		);
	}

}

export class App extends React.Component {

	render () {
		return (
			<div className="card">
				<div className="card-header">
					App Name
				</div>
				<img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" style={{width: '100%'}}/>
				<div className="card-block">
					<p className="card-text">
						Some quick example text to build on the card title and make up the bulk of the card's content.
					</p>
					<div className="btn-group btn-group-justified btn-block">
						<a href="#" style={{width: '50%'}} className="btn btn-success">Launch</a>
						<a href="#" style={{width: '50%'}} className="btn btn-warning">Edit</a>
					</div>
				</div>
			</div>
		);
	}

}
