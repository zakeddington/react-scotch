import React, { Component } from 'react';
import FlipMove from 'react-flip-move';
import PubSub from 'pubsub-js';
import AppEvents from 'config/AppEvents';

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
				<FlipMove
					staggerDurationBy="20"
					duration={200}
					enterAnimation={'elevator'}
					leaveAnimation={'elevator'}
					typeName="ul"
					className="distilleries"
					onStartAll={function(childElements) {
						PubSub.publish(AppEvents.LIST_ANIM_START, childElements);
					}}
					onFinishAll={function(childElements) {
						PubSub.publish(AppEvents.LIST_ANIM_END, childElements);
					}}
				>
					{listItems}
				</FlipMove>
			);
		}

		return <div>Loading...</div>;
	}
}

export default List;
