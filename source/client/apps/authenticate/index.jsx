import React from 'react';
import Footer from '../../components/footer';

export default class Authenticate extends React.Component {

	render () {
		const {state} = this.props;

		const permissions = [];
		let key = 0;
		state.permissions.forEach((permission) => {
			permissions.push(<li className="list-group-item" key={key++}>{permission}</li>);
		});

		return (
			<html>
				<head>
					<title>{state.serverName}</title>
					<script dangerouslySetInnerHTML={{__html: 'var INITIAL_STATE = JSON.parse(\'' + JSON.stringify(state) + '\');'}}/>
					<meta charSet="utf-8"/>
					<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

					<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js" charSet="utf-8" crossOrigin="anonymous"></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js" charSet="utf-8" crossOrigin="anonymous"></script>
					<script src="https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit" async defer></script>
					<link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/12-cube.svg/64px-12-cube.svg.png" crossOrigin="anonymous"/>
					<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" integrity="sha384-y3tfxAZXuh4HwSYylfB+J125MxIs6mR5FOHamPBG064zB+AFeWH94NdvaCBm8qnd" crossOrigin="anonymous"/>
					<link rel="stylesheet" href="/styles/main.css"/>
				</head>
				<body>
					<div className="jumbotron custom-noradius">
						<div className="container">
							<h1>Hello, {state.user.name}</h1>
							<div className="alert alert-warning">
								<a href={state.url}>{state.name}</a> <small className="text-muted">by <a href={state.author.url}>{state.author.name}</a></small> is requesting the following permissions:
							</div>
							<ul className="list-group">{permissions}</ul>
							<div className="btn-group" role="group" aria-label="Basic example">
								<a type="button" className="btn btn-success" href={'/authenticate/accept/' + state.token}>Accept</a>
								<a type="button" className="btn btn-danger" href={state.returnUrl.replace(':token', 'declined').replace(':server', state.serverName)}>Decline</a>
							</div>
						</div>
					</div>
					<Footer/>
				</body>
			</html>
		);
	}

}
