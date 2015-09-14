var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var api = require('../api.js');
var Menu = require('./menu.jsx');
var SideMenu = require('./side-menu.jsx');
var UploadBar = require('./upload-bar.jsx');

var App = React.createClass({
	getInitialState: function getInitialState () {
		return {
			showUploads: false,
			uploads: {},
			uploadFileName: 'Unnamed File',
			uploadFilePath: '/',
			uploadIndex: 0
		};
	},
	uploadClick: function uploadClick () {
		document.getElementById('fileUpload').click();
	},
	uploadFile: function uploadFile (e) {
		var that = this;
		var uploadIndex = this.state.uploadIndex;
		var files = document.getElementById('fileUpload').files;

		var file = files[0];

		for (var i = 0; i < files.length; i++) {

		}

		this.setState({
			uploadFileName: file.name,
			uploadFilePath: '/',
			uploadFileSize: Math.floor(file.size/1024/1024*100)/100 + 'MiB',
			uploadIndex: ++this.state.uploadIndex
		});
		$('#fileUploadModal').modal({
			blurring: true,
			onDeny: function onDeny () {
				console.log('deny');
			},
			onApprove: function onApprove () {
				var modifiedUploads = that.state.uploads;
				modifiedUploads[uploadIndex] = {
					name: that.state.uploadFileName,
					path: that.state.uploadFilePath,
					percent: 0,
					start: new Date().getTime()
				}
				that.setState({
					showUploads: true,
					uploads: modifiedUploads
				});
				var blobStream = api.uploadFile({
					file: file,
					name: that.state.uploadFileName,
					path: that.state.uploadFilePath
				});
				var size = 0;
			    blobStream.on('data', function(chunk) {
			        size += chunk.length;
					var percentage = Math.floor(size / file.size * 100);
					var modifiedUploads = that.state.uploads;
					if (size === file.size) {
						delete modifiedUploads[uploadIndex];
						if (Object.keys(modifiedUploads).length === 0) {
							that.setState({
								showUploads: false
							});
						}
					} else {
						modifiedUploads[uploadIndex].percent = percentage;
					}
					that.setState({
						uploads: modifiedUploads
					});
			    });
			}
		}).modal('show');
	},
	updateFileName: function updateFileName () {
		this.setState({
			uploadFileName: document.getElementById('uploadFileName').value
		});
	},
	render: function render () {
		return (
			<div>
				<Menu uploadClick={this.uploadClick}/>
				<div className="section group">
					<SideMenu/>
					<RouteHandler width={this.state.showUploads ? 8 : 10}/>
					{this.state.showUploads ? <UploadBar uploads={this.state.uploads}/> : null}
				</div>
				<input id="fileUpload" type="file" onChange={this.uploadFile} multiple={true} className="invisible"/>
				<div id="fileUploadModal" className="ui modal">
					<div className="header">
						<i className="uploadIcon"/>file upload
					</div>
					<div className="content">
						<table className="ui selectable inverted table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Status</th>
									<th className="right aligned">Notes</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>John</td>
									<td>Approved</td>
									<td className="right aligned">None</td>
								</tr>
								<tr>
									<td>Jamie</td>
									<td>Approved</td>
									<td className="right aligned">Requires call</td>
								</tr>
								<tr>
									<td>Jill</td>
									<td>Denied</td>
									<td className="right aligned">None</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="actions">
						<div className="ui green approve button"><i className="upload icon"/>upload</div>
						<div className="ui red cancel button"><i className="cancel icon"/>abort</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = App;
