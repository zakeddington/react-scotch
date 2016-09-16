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
				let altText = item.name + ' logo';
				let image   = '';

				if (item.image) {
					image   = <img src={item.image} alt={altText} />;
				}

				return (
					<li key={item.name}>
						<a href="#" className="item">
							<div className="image">
								{image}
							</div>
							<h3>{item.name}</h3>
							<ul className="types">
								<li><em>Founded:</em> {item.founded}</li>
								<li><em>Region:</em> {item.region}</li>
								<li><em>Type:</em>
								{item.types.map(function(type, i) {
									return(
										<span key={i}> {type}</span>
									);
								})}
								</li>
							</ul>
							<div className="intro" dangerouslySetInnerHTML={{__html: item.intro}} />
						</a>
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
