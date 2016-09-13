import React, { Component } from 'react';

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
						<p>{item.name}</p>
						<p><em>Founded:</em> {item.founded}</p>
						<p><em>Region:</em> {item.region}</p>
					</li>
				);
			});

			return (
				<ul className="distilleries">
					{listItems}
				</ul>
			);
		}

		return <div>Loading...</div>;

	}
}

export default List;
