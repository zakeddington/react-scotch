import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import PubSub from 'pubsub-js';
import AppEvents from 'config/AppEvents';
import Modal from './Modal';

class List extends Component {
	constructor(props) {
		super(props);

		this.elOverlay = document.createElement('div');
		this.elOverlay.id = 'modal-overlay';
		document.body.appendChild(this.elOverlay);

		this.createModal = this.createModal.bind(this);
	}

	createModal(event, data) {
		var trigger     = null;
		var renderModal = true;

		if (event.type === 'click') {
			event.preventDefault();
		}

		if (event.keyCode) {
			if (event.keyCode === 13) {
				event.preventDefault();
				trigger = event.currentTarget;
			} else {
				renderModal = false;
			}
		}

		if (renderModal) {
			ReactDOM.render(<Modal data={data} trigger={trigger} overlay={this.elOverlay} />, this.elOverlay);
		}
	}

	render() {
		var self = this;
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
						<a href="#test" className="item" onClick={(event) => self.createModal(event, item)} onKeyDown={(event) => self.createModal(event, item)}>
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
						if (childElements.length) {
							PubSub.publish(AppEvents.LIST_ANIM_START, childElements);
						}
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
