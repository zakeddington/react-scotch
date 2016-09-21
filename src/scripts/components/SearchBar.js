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
			isDisabled      : () => {}
		}

		this.onInputChange = this.onInputChange.bind(this);

		PubSub.subscribe(AppEvents.LIST_ANIM_START, this.onAnimStart.bind(this));
		PubSub.subscribe(AppEvents.LIST_ANIM_END, this.onAnimEnd.bind(this));
	}

	componentWillMount() {
		this.debounceInputChange = debounce(function() {
			this.props.inputChangeCallback.apply(this, [this.state.query]);
		}, 500);
	}

	onInputChange(event) {
		this.setState({query: this.refs.searchQueryInput.value});
		this.debounceInputChange();
	}

	onAnimStart(childElements) {
		this.setState({
			isDisabledClass : 'isDisabled',
			isDisabled      : e => e.preventDefault()
		});
	}

	onAnimEnd(childElements) {
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
					<ul>
						{listItems}
					</ul>

					<fieldset>
						<label htmlFor="search">Search Distilleries</label>
						<input
							autoComplete="off"
							id="search"
							type="search"
							placeholder="Search by Name"
							value={this.state.query}
							ref="searchQueryInput"
							onChange={this.onInputChange}
						/>
					</fieldset>
				</nav>
			);
		}

		return <div>Loading...</div>;
	}
}

export default SearchBar;
