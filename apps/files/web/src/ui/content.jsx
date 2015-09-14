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
			<div className={'col span-' + this.props.width + '-of-12'}>
				<table className="ui selectable celled structured table" style={{borderRadius: 0}}>
					<thead>
						<tr>
							<th rowSpan="2">Name</th>
							<th rowSpan="2">Type</th>
							<th rowSpan="2">Files</th>
							<th colSpan="3">Languages</th>
						</tr>
						<tr>
							<th>Ruby</th>
							<th>JavaScript</th>
							<th>Python</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Alpha Team</td>
							<td>Project 1</td>
							<td className="right aligned">2</td>
							<td className="center aligned">
								<i className="large green checkmark icon"></i>
							</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td rowSpan="3">Beta Team</td>
							<td>Project 1</td>
							<td className="right aligned">52</td>
							<td className="center aligned">
								<i className="large green checkmark icon"></i>
							</td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>Project 2</td>
							<td className="right aligned">12</td>
							<td></td>
							<td className="center aligned">
								<i className="large green checkmark icon"></i>
							</td>
							<td></td>
						</tr>
						<tr>
							<td>Project 3</td>
							<td className="right aligned">21</td>
							<td className="center aligned">
								<i className="large green checkmark icon"></i>
							</td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
            </div>
		);
	}
});
