var React = require('react');

var Link = require('react-router').Link;

var actions = require('../actions');

var store = require('../stores');

var path = require('path');

var Menu = React.createClass({
	createFolder: function createFolder () {
		actions.createFolder(prompt('Name?',path.join(this.state.path, '/folder/')));
	},
	getInitialState: store.getViewerState,
    componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function componentWillUnmount () {
		store.removeChangeListener(this._onChange);
	},
	moveUp: function moveUp () {
		actions.changeFolder(path.join('/', this.state.path, '../'));
	},
	uploadClick: function uploadClick () {
		document.getElementById('fileUpload').click();
	},
	render: function render () {
		return (
			<nav className="ui stackable borderless menu" style={{border: 0, borderRadius: 0, margin: 0}}>
				<a className="borderless item" onClick={this.historyBack}>
					<i className="left arrow icon"></i>
				</a>
				<a className="item" onClick={this.historyForward}>
					<i className="right arrow icon"></i>
				</a>
				<a className="item" onClick={this.moveUp}>
					<i className="up arrow icon"></i>
				</a>
				<div className="item">
					<PathView path={this.state.path}/>
				</div>
				<nav className="right borderless menu" style={{border: 0, borderRadius: 0}}>
					<a className="item" onClick={this.createFolder}>
						<i className="folder icon"></i>
						new folder
					</a>
					<a className="item" onClick={this.uploadClick}>
						<i className="upload icon"></i>
						upload
					</a>
				</nav>
			</nav>
		);
	},
	historyForward: function historyForward () {
		actions.history.forward();
	},
	historyBack: function historyBack () {
		actions.history.back();
	},
	_onChange: function _onChange () {
		this.setState(store.getViewerState);
	}
});

var PathView = React.createClass({
	render: function render () {
		var str = this.props.path.split('/');

		var folders = [];

		var keyIndex = 0;

		for (var i = 0; i < str.length; i++) {
			if (str[i] !== '') {
				folders.push(<div key={keyIndex++} className="divider"> / </div>);
				folders.push(<div key={keyIndex++} className="active section">{str[i]}</div>);
			}
		}

		folders.push(<div key={keyIndex} className="divider"> / </div>);

		return (
			<div className="ui breadcrumb">
				{folders}
			</div>
		);
	}
});

module.exports = Menu;
