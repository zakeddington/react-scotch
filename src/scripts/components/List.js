import React, { Component } from 'react';
// import http from 'http';

class List extends Component {
	constructor(props) {
		super(props);

		// this.state = {
		// 	data: null
		// }

		// this.loadData();
	}

	// loadData() {
	// 	http.get(this.props.url, (res) => {
	// 		var body = '';
	//
	// 		res.on('data', (chunk) => {
	// 			body += chunk;
	// 		});
	//
	// 		res.on('end', () => {
	// 			var data = JSON.parse(body);
	// 			this.setState({data: data});
	// 		});
	// 	}).on('error', (e) => {
	// 		console.error(this.props.url, status, e.toString());
	// 	});
	// }

	render() {
		if ( this.props.data ) {
			let listItems = this.props.data.map(function(item) {
				return (
					<li>
						<p>{item.name}</p>
						<p>{item.founded}</p>
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
