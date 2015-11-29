var React = require('react');

var store = require('../stores');

module.exports = React.createClass({
    getInitialState: store.getUploaderState,
    componentDidMount: function componentDidMount () {
		store.addChangeListener(this._onChange);
    },
	componentWillUnmount: function componentWillUnmount () {
		store.removeChangeListener(this._onChange);
	},
    render: function render () {
        var progressBars = [];
        for (var i in this.state.uploading) {
            progressBars.push(
                <div key={i} className="ui active tiny green progress" data-percent={this.state.uploading[i].percent}>
                    <div className="bar" style={{transitionDuration: '300ms', width: this.state.uploading[i].progress + '%'}}></div>
                    <div className="label">{this.state.uploading[i].name}</div>
                </div>
            );
        }
        return (
            <div className="col span-2-of-12" style={{padding: '0.5em'}}>
                <div className="ui tiny header">
                    <i className="upload icon"/>
                    <div className="content">
                        upload progress
                    </div>
                </div>
                {progressBars}
            </div>
        );
    },
    _onChange: function _onChange () {
        this.setState(store.getUploaderState());
    }
});
