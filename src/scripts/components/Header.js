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
				<div className="header--nav">
					<ul className="header--menu">
						<li>
							<Link to="speyside">Speyside</Link>
						</li>
						<li>
							<Link to="highlands">Highlands</Link>
						</li>
					</ul>
				</div>
			</header>
		);
	}
}

export default Header;
