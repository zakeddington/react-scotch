import React, { Component } from 'react';
import { Link } from 'react-router';
import SearchBar from './SearchBar';
import List from './List';
import http from 'http';


class Home extends Component {
	constructor(props) {
		super(props);

		this.handleUserInput = this.handleUserInput.bind(this);

		this.api = '/assets/data/distilleries.json';

		this.state = {
			data       : null,
			searchText : ''
		}

		if ( !this.state.data ) {
			this.loadData();
		}
	}

	handleUserInput(searchText) {
		this.setState({
			searchText: searchText
		});
	}

	loadData() {
		http.get(this.api, (res) => {
			var body   = '';

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
					<nav>
						<ul>
							<li>
								<Link activeClassName="isActive" to="all">
									<span>All</span>
									<span className="count">({this.state.data.All.length})</span>
								</Link>
							</li>
							<li>
								<Link activeClassName="isActive" to="campbeltown">
									<span>Campbeltown</span>
									<span className="count">({this.state.data.Campbeltown.length})</span>
								</Link>
							</li>
							<li>
								<Link activeClassName="isActive" to="highland">
									<span>Highland</span>
									<span className="count">({this.state.data.Highland.length})</span>
								</Link>
							</li>
							<li>
								<Link activeClassName="isActive" to="islands">
									<span>Islands</span>
									<span className="count">({this.state.data.Islands.length})</span>
								</Link>
							</li>
							<li>
								<Link activeClassName="isActive" to="islay">
									<span>Islay</span>
									<span className="count">({this.state.data.Islay.length})</span>
								</Link>
							</li>
							<li>
								<Link activeClassName="isActive" to="lowland">
									<span>Lowland</span>
									<span className="count">({this.state.data.Lowland.length})</span>
								</Link>
							</li>
							<li>
								<Link activeClassName="isActive" to="speyside">
									<span>Speyside</span>
									<span className="count">({this.state.data.Speyside.length})</span>
								</Link>
							</li>
						</ul>

						<SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput} />
					</nav>

					<List data={this.state.data[region]} searchText={this.state.searchText}></List>
				</div>
			);
		}

		return <div>Loading Home...</div>;
	}

}

export default Home;
