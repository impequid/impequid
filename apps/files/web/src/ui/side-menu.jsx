var React = require('react');

module.exports = React.createClass({
    getInitialState: function getInitialState () {
		return {
			folders: [],
			files: []
		};
	},
	handleClick: function handleClick () {
		// TODO
	},
    render: function render () {
        var files = [];
		for (var i = 0; i < this.state.files.length; i++) {
			files.push(
                <div className="item">
                    <i className="file icon"></i>
                    <div className="content">
                        <div className="header">{this.state.files[i]}</div>
                    </div>
                </div>
            );
		}
        return (
            <div className="two wide column" style={{paddingTop: 0, paddingBottom: 0}}>
                <div className="ui basic segment">
                    <div className="ui list">
                        {files}
                    </div>
                </div>
            </div>
        );
    },
	componentDidMount: function componentDidMount () {
		var that = this;
		window.socket.emit('filesystem:folder:get', '/', function (err, data) {
			console.log('filesystem:folder:get', err, data);
			that.setState({
				folder: data.folders,
				files: data.files
			});
		});
	}
});
/*
<div className="item">
    <i className="folder icon"></i>
    <div className="content">
        <div className="header">src</div>
        <div className="list">
            <div className="item">
                <i className="folder icon"></i>
                <div className="content">
                    <div className="header">site</div>
                </div>
            </div>
            <div className="item">
                <i className="folder icon"></i>
                <div className="content">
                    <div className="header">themes</div>
                    <div className="list">
                        <div className="item">
                            <i className="folder icon"></i>
                            <div className="content">
                                <div className="header">default</div>
                            </div>
                        </div>
                        <div className="item">
                            <i className="folder icon"></i>
                            <div className="content">
                                <div className="header">my_theme</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="item">
                <i className="file icon"></i>
                <div className="content">
                    <div className="header">theme.config</div>
                </div>
            </div>
        </div>
    </div>
</div>
<div className="item">
    <i className="folder icon"></i>
    <div className="content">
        <div className="header">dist</div>
        <div className="list">
            <div className="item">
                <i className="folder icon"></i>
                <div className="content">
                    <div className="header">components</div>
                </div>
            </div>
        </div>
    </div>
</div>
<div className="item">
    <i className="file icon"></i>
    <div className="content">
        <div className="header">semantic.json</div>
    </div>
</div>
*/
