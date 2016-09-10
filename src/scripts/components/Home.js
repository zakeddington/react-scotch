import React, { Component } from 'react';
import List from './List';
import http from 'http';


class Home extends Component {
	constructor(props) {
		super(props);

		this.api = '/assets/data/distilleries.json';

		console.log('constructor Home');

		this.state = {
			data : null
		}

		if ( !this.state.data ) {
			this.loadData();
		}

	}

	loadData() {
		http.get(this.api, (res) => {
			var body   = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				var data = JSON.parse(body);
				this.setState({data: data});
			});
		}).on('error', (e) => {
			console.error(this.api, status, e.toString());
		});
	}

	render() {
		var region = this.props.route.region;
		console.warn('render Home');
		console.warn(region);

		if ( this.state.data ) {
			console.warn(this.state.data[region]);
			return (
				<List data={this.state.data[region]}></List>
			);
		}

		return <div>Loading Home...</div>;
	}

}

export default Home;
