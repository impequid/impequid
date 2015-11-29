var React = require('react');

var Component = React.createClass({
	render: function render () {
		return (
			<nav className="ui stackable borderless menu" style={{border: 0, borderRadius: 0, margin: 0}}>
				<a className="borderless item">
					<i className="add icon"></i> new note
				</a>
				<div className="item">
					title
				</div>
				<nav className="right borderless menu" style={{border: 0, borderRadius: 0}}>
					<a className="item">
						<i className="edit icon"></i>
						edit
					</a>
				</nav>
			</nav>
		);
	}
});

module.exports = Component;
