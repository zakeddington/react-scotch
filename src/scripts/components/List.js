import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class List extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var origData;
		var searchText;
		var curData = [];


		if (this.props.data) {
			origData = this.props.data;
			searchText  = this.props.searchText.toLowerCase();

			if (searchText) {
				origData.forEach(function(item) {
					let name = item.name.toLowerCase();
					if (name.indexOf(searchText) === -1) {
						return;
					}
					curData.push(item);
				});
			} else {
				curData = origData;
			}

			let listItems = curData.map(function(item) {
				return (
					<li key={item.name}>
						<div className="item">
							<h3>{item.name}</h3>
							<p><em>Founded:</em> {item.founded}</p>
							<p><em>Region:</em> {item.region}</p>
						</div>
					</li>
					);
			});

			return (
				<ReactCSSTransitionGroup
					component="ul"
					className="distilleries"
					transitionName="anim"
					transitionEnterTimeout={350}
					transitionLeaveTimeout={0}>
						{listItems}
				</ReactCSSTransitionGroup>
			);
		}

		return <div>Loading...</div>;

	}
}

export default List;
