import React from 'react';
import ReactDOM from 'react-dom/server';
import App from '../../client/components/authenticate';

import actions from '../../client/actions/authenticate';

export default class ServerSideAuthenticate extends React.Component {

	render () {
		actions.hydrate(this.props.initialState);

		return (
			<html>
				<head>
					<title>Impequid</title>
					<script dangerouslySetInnerHTML={{__html: `var INITIAL_STATE = JSON.parse('${JSON.stringify(this.props.initialState)}');`}}/>
					<meta charSet="utf-8"/>
					<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
					<meta name="robots" content="noindex"/>

					<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js" charSet="utf-8" crossOrigin="anonymous"></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js" charSet="utf-8" crossOrigin="anonymous"></script>
					<script src="https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit" async defer></script>
					<link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/12-cube.svg/64px-12-cube.svg.png" crossOrigin="anonymous"/>
					<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" integrity="sha384-y3tfxAZXuh4HwSYylfB+J125MxIs6mR5FOHamPBG064zB+AFeWH94NdvaCBm8qnd" crossOrigin="anonymous"/>
					<link rel="stylesheet" href="/styles/main.css"/>

					<script src="/bundle/authenticate.js"/>
				</head>
				<body>
					<div id="app" dangerouslySetInnerHTML={{__html: ReactDOM.renderToString(<App/>)}}></div>
				</body>
			</html>
		);
	}

}
