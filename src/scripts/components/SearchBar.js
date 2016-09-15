import React, { Component } from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import AppEvents from 'config/AppEvents';

class SearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isDisabledClass : '',
			isDisabled: () => {}
		}

		this.handleChange = this.handleChange.bind(this);

		PubSub.subscribe(AppEvents.LIST_ANIM_START, this.onAnimStart.bind(this));
		PubSub.subscribe(AppEvents.LIST_ANIM_END, this.onAnimEnd.bind(this));
	}

	handleChange() {
		this.props.onUserInput(
			this.refs.searchTextInput.value
		);
	}

	onAnimStart() {
		console.log('anim start');
		this.setState({
			isDisabledClass: 'isDisabled',
			isDisabled: e => e.preventDefault()
		});
	}

	onAnimEnd() {
		console.log('anim end');
		this.setState({
			isDisabledClass: '',
			isDisabled: () => {}
		});
	}

	render() {
		var origData  = this.props.data;
		var listItems = [];

		if (origData) {
			for (let prop in origData) {
				if (origData.hasOwnProperty(prop)) {
					listItems.push(
						<li key={prop}>
							<Link activeClassName="isActive" className={this.state.isDisabledClass} to={prop} key={prop}
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
							onChange={this.handleChange}
						/>
					</form>
				</nav>
			);
		}

		return <div>Loading...</div>;
	}
}

export default SearchBar;
