var React = require('react');
var path = require('path');

var store = require('../stores');
var actions = require('../actions');

module.exports = React.createClass({
    getInitialState: store.getViewerState,
    componentDidMount: function componentDidMount () {
        store.addChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount () {
        store.removeChangeListener(this._onChange);
    },
    render: function render () {
        var files = [];
        for (var i = 0; i < this.state.files.length; i++) {
            files.push(
				<FileView path={path.join(this.state.path, this.state.files[i].name)} name={this.state.files[i].name} size={this.state.files[i].size} key={i}/>
			);
		}
        var folders = [];
		for (var i = 0; i < this.state.folders.length; i++) {
			folders.push(
				<FolderView path={path.join(this.state.path, this.state.folders[i])} name={this.state.folders[i]} key={i}/>
			);
		}
		return (
			<div className={'col span-' + this.props.width + '-of-12'}>
				<table className="ui selectable celled structured table" style={{borderRadius: 0}}>
					<thead>
						<tr>
							<th>name</th>
							<th>size</th>
							<th className="collapsing right aligned">actions</th>
						</tr>
					</thead>
					<tbody>
                        {folders}
						{files}
					</tbody>
				</table>
            </div>
		);
	},
    _onChange: function _onChange () {
        this.setState(store.getViewerState());
    }
});

var FolderView = React.createClass({
    render: function render () {
        return (
            <tr>
                <td onClick={this.openFolder}><i className="folder icon"/>{this.props.name}</td>
                <td/>
                <td className="collapsing right aligned">
                    <div className="ui small icon buttons">
                        <div className="ui icon button" onClick={this.renameFolder}>
                            <i className="edit icon"/>
                        </div>
                        <div className="ui icon button" onClick={this.deleteFolder}>
                            <i className="delete icon"/>
                        </div>
                    </div>
                </td>
            </tr>
        );
    },
    openFolder: function openFolder () {
        actions.changeFolder(this.props.path);
    },
    renameFolder: function renameFile () {
        actions.renameFolder(this.props.path, prompt('New folder name/path?', this.props.path));
    },
    deleteFolder: function deleteFolder () {
        actions.deleteFolder(this.props.path);
    }
});

var FileView = React.createClass({
    render: function render () {
        return(
            <tr>
                <td onClick={this.openFile}><i className="file icon"/>{this.props.name}</td>
                <td>{window.fancyFileSize(this.props.size, 2)}</td>
                <td className="collapsing right aligned">
                    <div className="ui small icon buttons">
                        <div className="ui icon button" onClick={this.downloadFile}>
                            <i className="download icon"/>
                        </div>
                        <div className="ui icon button" onClick={this.renameFile}>
                            <i className="edit icon"/>
                        </div>
                        <div className="ui icon button" onClick={this.deleteFile}>
                            <i className="delete icon"/>
                        </div>
                    </div>
                </td>
            </tr>
        );
    },
    renameFile: function renameFile () {
        actions.renameFile(this.props.path, prompt('New file name/path?', this.props.path));
    },
    openFile: function openFile () {
        actions.openFile(this.props.path);
    },
    deleteFile: function deleteFile () {
        actions.deleteFile(this.props.path);
    },
    downloadFile: function downloadFile () {
        actions.downloadFile(this.props.path);
    }
});
