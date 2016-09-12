import React, { Component } from 'react';
import { Link } from 'react-router';

class Header extends Component {

	render() {
		return (
			<header className="header">
				<h1>Scotch</h1>
				{/*
				<div className="header--logo">
					 <img src='assets/img/banner.png' alt="POP"/>
				</div>
				*/}
				<ul>
					<li>
						<Link activeClassName="isActive" to="all">All</Link>
					</li>
					<li>
						<Link activeClassName="isActive" to="campbeltown">Campbeltown</Link>
					</li>
					<li>
						<Link activeClassName="isActive" to="highlands">Highlands</Link>
					</li>
					<li>
						<Link activeClassName="isActive" to="islay">Islay</Link>
					</li>
					<li>
						<Link activeClassName="isActive" to="lowlands">Lowlands</Link>
					</li>
					<li>
						<Link activeClassName="isActive" to="speyside">Speyside</Link>
					</li>
				</ul>
			</header>
		);
	}
}

export default Header;
