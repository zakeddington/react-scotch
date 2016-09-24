import React, { Component } from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import AppEvents from 'config/AppEvents';
import debounce from 'utilities/Debounce';

class SearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			query           : '',
			isDisabledClass : '',
			isDisabled      : () => {},
			view            : 'grid-view'
		}

		this.onInputChange = this.onInputChange.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);

		PubSub.subscribe(AppEvents.LIST_ANIM_START, this.onAnimStart.bind(this));
		PubSub.subscribe(AppEvents.LIST_ANIM_END, this.onAnimEnd.bind(this));
	}

	componentDidMount() {
		PubSub.publish(AppEvents.LIST_LAYOUT_CHANGE, this.state.view);
	}

	componentWillMount() {
		this.debounceInputChange = debounce(function() {
			this.props.inputChangeCallback.apply(this, [this.state.query]);
		}, 500);
	}

	onRadioChange(event) {
		var curView = event.currentTarget.value;

		if (curView !== this.state.view) {
			this.setState({view: curView});
			PubSub.publish(AppEvents.LIST_LAYOUT_CHANGE, curView);
		}
	}

	onInputChange(event) {
		this.setState({query: this.refs.searchQueryInput.value});
		this.debounceInputChange();
	}

	onAnimStart(eventName, childElements) {
		this.setState({
			isDisabledClass : 'isDisabled',
			isDisabled      : e => e.preventDefault()
		});
	}

	onAnimEnd(eventName, childElements) {
		this.setState({
			isDisabledClass : '',
			isDisabled      : () => {}
		});
	}

	render() {
		var origData  = this.props.data;
		var listItems = [];

		if (origData) {
			for (let prop in origData) {
				if (origData.hasOwnProperty(prop)) {
					let propUrl = prop.toLowerCase();
					listItems.push(
						<li key={prop}>
							<Link activeClassName="isActive" className={this.state.isDisabledClass} to={propUrl} key={prop}
								onClick={this.state.isDisabled}
							>
								<span>{prop}</span>
								<span className="count">({origData[prop].length})</span>
							</Link>
						</li>
					);
				}
			};

			return (
				<nav>
					<div className="container">
						<ul className="filter-category">
							{listItems}
						</ul>

						<fieldset className="filter-search">
							<label htmlFor="search">Search Distilleries</label>
							<input
								autoComplete="off"
								id="search"
								type="search"
								placeholder="Filter category by name"
								value={this.state.query}
								ref="searchQueryInput"
								onChange={this.onInputChange}
							/>
						</fieldset>

						<fieldset className="filter-view">
							<ul>
								<li>
									<input
										type="radio"
										id="grid-view"
										name="view-options"
										value="grid-view"
										ref="gridView"
										checked={this.state.view === 'grid-view'}
										onChange={this.onRadioChange}
									/>
									<label htmlFor="grid-view" className="label-grid">
										<svg className="icon icon-grid"><use xlinkHref='#icon-grid' /></svg>
										Grid View
									</label>
								</li>
								<li>
									<input
										type="radio"
										id="list-view"
										name="view-options"
										value="list-view"
										ref="listView"
										checked={this.state.view === 'list-view'}
										onChange={this.onRadioChange}
									/>
									<label htmlFor="list-view" className="label-list">
										<svg className="icon icon-list"><use xlinkHref='#icon-list' /></svg>
										List View
									</label>
								</li>
							</ul>
						</fieldset>
					</div>
				</nav>
			);
		}

		return <div>Loading...</div>;
	}
}

export default SearchBar;
