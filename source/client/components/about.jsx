import React from 'react';

export default class About extends React.Component {

	render () {
		return (
			<main>
				<section className="jumbotron text-xs-center custom-noradius">
					<div className="container">
						<h1 className="jumbotron-heading">
							Impequid
						</h1>
						<p className="lead text-muted">
							Impequid is a decentralized app-based cloud, which you can easily setup yourself. Apps are completely separate from impequid, which means you can use every impequid app, while it stores the data on your own server.
						</p>
						<p className="btn-group">
							<a href="/login" className="btn btn-primary">Login</a>
							<a href="/register" className="btn btn-secondary">Register</a>
						</p>
					</div>
				</section>
				<div className="container custom-about">
					<div className="row">
						<div className="col-lg-6">
							<img className="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"/>
							<h2>Control Your Data</h2>
							<p>
								Impequid apps allow you to use your own backend, so you can have more control over your data.
							</p>
							<p><a className="btn btn-secondary" href="https://github.com/dodekeract/impequid" role="button">View details &raquo;</a></p>
						</div>
						<div className="col-lg-6">
							<img className="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"/>
							<h2>Open Source</h2>
							<p>
								Impequid is MIT licensed, this means you can easily setup your own cloud, read the source-code or even contribute.
							</p>
							<p><a className="btn btn-secondary" href="https://github.com/dodekeract/impequid" role="button">View On GitHub &raquo;</a></p>
						</div>
					</div>
				</div>
			</main>
		);
	}

}
