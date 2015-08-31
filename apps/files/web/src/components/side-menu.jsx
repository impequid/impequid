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
			files.push(<a className="item"><i className="file outline icon"></i>{this.state.files[i]}</a>);
		}
        return (
            <div className="red two wide column" style={{paddingTop: 0, paddingBottom: 0, borderRight: '1px solid #CCC'}}>
                <div className="ui basic segment">
                    <div className="ui list">
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
                    </div>
                </div>
            </div>
        );
    }
});
