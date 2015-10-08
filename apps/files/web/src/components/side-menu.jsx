var React = require('react');

var store = require('../stores');
var actions = require('../actions');

var path = require('path');

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
		for (var i in this.state.files) {
			files.push(
                <div key={i} className="item">
                    <i className="file icon"></i>
                    <div className="content">
                        <div className="header">{this.state.files[i].name}</div>
                    </div>
                </div>
            );
		}
        var folders = [];
		for (var i in this.state.folders) {
			folders.push(
                <FolderView key={i} path={path.join(this.state.path, this.state.folders[i])} name={this.state.folders[i]}/>
            );
		}
        return (
            <div className="col span-2-of-12" style={{paddingTop: 0, paddingBottom: 0}}>
                <div className="ui basic segment">
                    <div className="ui list">
                        <div className="item" onClick={this.goToRoot}>
                            <i className="disk outline icon"></i>
                            <div className="content">
                                <div className="header">root</div>
                            </div>
                        </div>
                        <div className="item">
                            <i className="share icon"></i>
                            <div className="content">
                                <div className="header">shares</div>
                            </div>
                        </div>
                        {folders}
                        {files}
                    </div>
                </div>
            </div>
        );
    },
    goToRoot: function goToRoot () {
        actions.changeFolder('/');
    },
    _onChange: function _onChange () {
        this.setState(store.getSidebarState());
    }
});

var FolderView = React.createClass({
    render: function render () {
        return (
            <div className="item" onClick={this.open}>
                <i className="folder icon"></i>
                <div className="content">
                    <div className="header">{this.props.name}</div>
                </div>
            </div>
        );
    },
    open: function open () {
        actions.changeFolder(this.props.path);
    }
});
