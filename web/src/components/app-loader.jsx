var React = require('react');

var Dashboard = React.createClass({
	getInitialState: function () {
		return {
			content: (<div>getting token</div>)
		}
	},
	componentDidMount: function componentDidMount (name) {
		name = name || this.props.params.name;
		var that = this;
		window.socket.emit('token:create', name, function (err, token) {
			console.log(err, token);
			if (!err) {
				that.setState({
					content: (<iframe className="application" src={'https://' + name + '.dodekeract.report:8443?token=' + token}></iframe>)
				});
			} else {
				that.setState({
					content: (<div>error creating token: {err}</div>)
				});
			}
		})
	},
	componentWillReceiveProps: function (nextProps) {
		this.componentDidMount(nextProps.params.name);
	},
	getToken: function () {
		var that = this;
		window.socket.emit('token:create', 'notes', function (err, token) {
			if (!err) that.setState({
				token: token
			});
		});
	},
	render: function render () {
		return (
			this.state.content
		);
	}
});

module.exports = Dashboard;
