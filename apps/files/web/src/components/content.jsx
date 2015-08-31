var React = require('react');

module.exports = React.createClass({
	componentWillReceiveProps: function componentWillReceiveProps (nextProps) {
        this.setState({
            folder: nextProps.params.folder
        });
    },
    getInitialState: function getInitialState () {
        return {
            folder: ['folder']
        };
    },
    render: function render () {
		return (
			<div className="green fourteen wide column">
                File View
            </div>
		);
        // <div className="ui bottom attached segment">
	},
    componentDidMount: function componentDidMount () {
        // $('.sidebar').sidebar();
    }
});
