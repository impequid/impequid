var React = require('react');

module.exports = React.createClass({
    render: function render () {
        var progressBars = [];
        for (var i in this.props.uploads) {
            progressBars.push(
                <div key={i} className="ui active tiny green progress" data-percent={this.props.uploads[i].percent}  data-content="Hello. This is a mini popup" data-variation="mini">
                    <div className="bar" style={{transitionDuration: '300ms', width: this.props.uploads[i].percent + '%'}}></div>
                    <div className="label">{this.props.uploads[i].name}</div>
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
    componentDidMount: function componentDidMount () {
        this.componentDidUpdate();
    },
    componentDidUpdate: function componentDidUpdate () {
        // $('.ui.active.tiny.green.progress[data-percent=0]').popup();
    }
});
