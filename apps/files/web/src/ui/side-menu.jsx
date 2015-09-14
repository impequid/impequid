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
                <div key={i} className="item">
                    <i className="file icon"></i>
                    <div className="content">
                        <div className="header">{this.state.files[i]}</div>
                    </div>
                </div>
            );
		}
        return (
            <div className="col span-2-of-12" style={{paddingTop: 0, paddingBottom: 0}}>
                <div className="ui basic segment">
                    <div className="ui list">
                        <div className="item">
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
