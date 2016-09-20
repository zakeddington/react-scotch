import React, { Component } from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import AppEvents from 'config/AppEvents';

class SearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isDisabledClass : '',
			isDisabled      : () => {}
		}

		this.onInputChange = this.onInputChange.bind(this);

		PubSub.subscribe(AppEvents.LIST_ANIM_START, this.onAnimStart.bind(this));
		PubSub.subscribe(AppEvents.LIST_ANIM_END, this.onAnimEnd.bind(this));
	}

	onInputChange() {
		this.props.onUserInput(
			this.refs.searchTextInput.value
		);
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

					<form>
						<label htmlFor="search">Search Distilleries</label>
						<input
							id="search"
							type="search"
							placeholder="Search by Name"
							value={this.props.searchText}
							ref="searchTextInput"
							onChange={this.onInputChange}
						/>
					</form>
				</nav>
			);
		}

		return <div>Loading...</div>;
	}
}

export default SearchBar;
