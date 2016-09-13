import React, { Component } from 'react';

class SearchBar extends Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange() {
		this.props.onUserInput(
			this.refs.searchTextInput.value
		);
	}

	render() {
		return (
			<form>
				<label htmlFor="search">Search Distilleries</label>
				<input
					id="search"
					type="text"
					placeholder="Search by Name"
					value={this.props.searchText}
					ref="searchTextInput"
					onChange={this.handleChange}
				/>
			</form>
		);
	}
}

export default SearchBar;
