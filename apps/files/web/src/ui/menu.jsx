var React = require('react');

var Link = require('react-router').Link;

var Menu = React.createClass({
	render: function render () {
		return (
			<nav className="ui stackable borderless menu" style={{border: 0, borderRadius: 0}}>
				<a className="borderless item">
					<i className="left arrow icon"></i>
				</a>
				<a className="item">
					<i className="right arrow icon"></i>
				</a>
				<a className="item">
					<i className="up arrow icon"></i>
				</a>
				<div className="item">
					<div className="ui breadcrumb">
						<div className="divider"> / </div>
						<div className="active section">folder</div>
						<div className="divider"> / </div>
					</div>
				</div>
				<nav className="right borderless menu" style={{border: 0, borderRadius: 0}}>
					<a className="item">
						<i className="favorite icon"></i>
						Favorites
					</a>
				</nav>
			</nav>
		);
	}
});

module.exports = Menu;
