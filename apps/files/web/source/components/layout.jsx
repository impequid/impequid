var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var Menu = require('./menu.jsx');
var SideMenu = require('./side-menu.jsx');
var UploadBar = require('./upload-bar.jsx');

var actions = require('../actions');
var store = require('../stores');

var App = React.createClass({
	getInitialState: store.getUploaderState,
	componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
		$('#fileUploadModal').modal({
			blurring: true,
			closable: false,
			onDeny: function onDeny () {
				actions.abortFileUpload();
			},
			onApprove: function onApprove () {
				actions.uploadFiles();
			}
		});
	},
	componentWillUnmount: function componentWillUnmount () {
		store.removeChangeListener(this._onChange);
	},
	componentDidUpdate: function componentDidUpdate () {
		if (this.state.show) {
			$('#fileUploadModal').modal('show').resize();
		} else {
			$('#fileUploadModal').modal('hide');
		}
	},
	uploadFiles: function uploadFiles () {
		actions.addFilesToUpload(document.getElementById('fileUpload').files);
	},
	render: function render () {
		var files = [];
		for (var i in this.state.files) {
			files.push(
				<FileListEntry key={i} uuid={i} file={this.state.files[i]}/>
			);
		}
		var showUploadBar = Object.keys(this.state.uploading).length;
		return (
			<div>
				<Menu/>
				<div className="section group">
					<SideMenu/>
					<RouteHandler width={showUploadBar ? 8 : 10}/>
					{showUploadBar ? <UploadBar/> : null}
				</div>
				<input id="fileUpload" type="file" onChange={this.uploadFiles} multiple={true} className="invisible"/>
				<div id="fileUploadModal" className="ui fullscreen modal">
					<div className="header">
						<i className="uploadIcon"/>file upload
					</div>
					<div className="content">
						<table className="ui selectable inverted table">
							<thead>
								<tr>
									<th>name</th>
									<th>size</th>
									<th>actions</th>
								</tr>
							</thead>
							<tbody>
								{files}
							</tbody>
						</table>
					</div>
					<div className="actions">
						<div className="ui green approve button"><i className="upload icon"/>upload</div>
						<div className="ui yellow button" onClick={this.uploadClick}><i className="add icon"/>add more</div>
						<div className="ui red cancel button"><i className="cancel icon"/>abort</div>
					</div>
				</div>
			</div>
		);
	},
	_onChange: function _onChange () {
		this.setState(store.getUploaderState());
	}
});

var FileListEntry = React.createClass({
	render: function render () {
		return (
			<tr>
				<td>
					{this.props.file.name}
				</td>
				<td>
					{window.fancyFileSize(this.props.file.size, 2)}
				</td>
				<td className="right aligned collapsing">
					<div className="ui small icon buttons">
						<div className="ui icon button" onClick={this.deleteItem}>
							<i className="delete icon"/>
						</div>
					</div>
				</td>
			</tr>
		);
	},
	deleteItem: function deleteItem () {
		actions.deleteUploadItem(this.props.uuid);
	}
});

module.exports = App;
