import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import PubSub from 'pubsub-js';
import AppEvents from 'config/AppEvents';
import Modal from './Modal';

class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			query       : '',
			layoutClass : 'distilleries'
		}

		this.elOverlay = document.createElement('div');
		this.elOverlay.id = 'modal-overlay';
		document.body.appendChild(this.elOverlay);

		this.createModal = this.createModal.bind(this);

		PubSub.subscribe(AppEvents.LIST_LAYOUT_CHANGE, this.onLayoutChange.bind(this));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query !== this.state.query) {
			this.setState({query: nextProps.query});
		}
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

	onLayoutChange(eventName, layoutClass) {
		var curClass = 'distilleries ' + layoutClass;
		this.setState({layoutClass: curClass})
	}

	render() {
		var self = this;
		var origData;
		var curData = [];
		var query;
		var listItems;

		if (this.props.data) {
			origData  = this.props.data;
			query     = this.state.query.toLowerCase();

			if (query) {
				origData.forEach(function(item) {
					let name = item.name.toLowerCase();
					if (name.indexOf(query) === -1) {
						return;
					}
					curData.push(item);
				});
			} else {
				curData = origData;
			}

			if (curData.length) {
				listItems = curData.map(function(item) {
					let altText = item.name + ' logo';
					let image   = '';
					let website = '';

					if (item.image) {
						image   = <img src={item.image} alt={altText} />;
					}

					if (item.website) {
						website =
							<a href={item.website} className="website" target="_blank">
								Visit site
								<svg aria-hidden="true" className="icon icon-external"><use xlinkHref='assets/img/icons.svg#icon-external' /></svg>
							</a>;
					}

					return (
						<li key={item.name}>
							<a href="#" className="item" onClick={(event) => self.createModal(event, item)} onKeyDown={(event) => self.createModal(event, item)}>
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
							{website}
						</li>
					);
				});
			} else {
				listItems = [<li key={"noResultsMsg"} className="no-results"><h3>Sorry, there are no results for that name.</h3></li>];
			}

			return (
				<div className="container">
					<FlipMove
						staggerDurationBy="20"
						duration={200}
						enterAnimation={'elevator'}
						leaveAnimation={'elevator'}
						typeName="ul"
						className={this.state.layoutClass}
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
				</div>
			);
		}

		return <div className="loading-overlay"><div className="loading">Loading...</div></div>;
	}
}

export default List;
