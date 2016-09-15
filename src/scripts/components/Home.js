import React, { Component } from 'react';
import SearchBar from './SearchBar';
import List from './List';
import http from 'http';


class Home extends Component {
	constructor(props) {
		super(props);

		this.onUserInput = this.onUserInput.bind(this);

		this.api = '/assets/data/distilleries.json';

		this.state = {
			data       : null,
			searchText : ''
		}

		if ( !this.state.data ) {
			this.loadData();
		}
	}

	onUserInput(searchText) {
		this.setState({
			searchText: searchText
		});
	}

	loadData() {
		http.get(this.api, (res) => {
			var body = '';

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				var data       = JSON.parse(body);
				var allRegions = [];

				for (let region in data) {
					if (region.length) {
						Array.prototype.push.apply(allRegions, data[region]);
					}
				}

				data.All = allRegions;

				data.All.sort(function(a, b) {
					var nameA = a.name.toLowerCase();
					var nameB = b.name.toLowerCase();

					if (nameA < nameB) {
						return -1;
					} else if (nameA > nameB) {
						return 1;
					}

					return 0;
				});

				this.setState({ data: data });
			});
		}).on('error', (e) => {
			console.error(this.api, status, e.toString());
		});
	}

	render() {
		var region = this.props.route.region;

		if ( this.state.data ) {
			return (
				<div>
					<SearchBar data={this.state.data} searchText={this.state.searchText} onUserInput={this.onUserInput} />

					<List data={this.state.data[region]} searchText={this.state.searchText}></List>
				</div>
			);
		}

		return <div>Loading Home...</div>;
	}

}

export default Home;
