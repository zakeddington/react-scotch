import React, { Component } from 'react';

class Header extends Component {
	render() {
		return (
			<header className="header">
				<h1><span>Scotch Distilleries</span></h1>
				{/*
				<div className="header--logo">
					 <img src='assets/img/banner.png' alt="POP"/>
				</div>
				*/}
			</header>
		);
	}
}

export default Header;
