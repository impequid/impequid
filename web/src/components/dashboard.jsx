var React = require('react');

var Dashboard = React.createClass({
	getInitialState: function () {
		return {
			filesToken: 'none',
			notesToken: 'none',
			galleryToken: 'none'
		};
	},
	getGalleryToken: function () {
		var that = this;
		window.socket.emit('token:create', 'gallery', function (err, token) {
			if (!err) that.setState({
				galleryToken: token
			});
		});
	},
	getFilesToken: function () {
		var that = this;
		window.socket.emit('token:create', 'files', function (err, token) {
			if (!err) that.setState({
				filesToken: token
			});
		});
	},
	getNotesToken: function () {
		var that = this;
		window.socket.emit('token:create', 'notes', function (err, token) {
			if (!err) that.setState({
				notesToken: token
			});
		});
	},
	render: function render () {
		return (
			<main className="column">
				<div className="ui grid">
			        <div className="row">
			            <div className="column padding-reset">
							<div className="ui huge message page grid">
								<h1 className="ui huge header">impequid</h1>
								<p>Online Operating System. Modular. With apps. Secured by subdomain policies. Powered by Node.js and WebSockets.</p>
			                    <a className="ui blue button" href="https://github.com/dodekeract/impequid">Impequid on GitHub</a>
							</div>
			            </div>
			        </div>
			    </div>
			    <div className="ui hidden divider"></div>
			    <div className="ui page grid">
			        <div className="three column row">
			            <div className="column">
			                <h2 className="ui header">Files</h2>
			                <p>
								<div className="ui input">
									<input type="text" value={this.state.filesToken} readOnly={true} />
								</div>
							</p>
			                <button className="ui tiny button" onClick={this.getFilesToken}>Get Files Token</button>
			            </div>
			            <div className="column">
			                <h2 className="ui header">Gallery</h2>
			                <p>
								<div className="ui input">
									<input type="text" value={this.state.galleryToken} readOnly={true} />
								</div>
							</p>
			                <button className="ui tiny button" onClick={this.getGalleryToken}>Get Gallery Token</button>
			            </div>
			            <div className="column">
			                <h2 className="ui header">Notes</h2>
			                <p>
								<div className="ui input">
									<input type="text" value={this.state.notesToken} readOnly={true} />
								</div>
							</p>
			                <button className="ui tiny button" onClick={this.getNotesToken}>Get Notes Token</button>
			            </div>
			        </div>
			    </div>
			</main>
		);
	}
});

module.exports = Dashboard;
