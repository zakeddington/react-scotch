import React, { Component } from 'react';

class List extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if ( this.props.data ) {
			let listItems = this.props.data.map(function(item) {
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
