import React, { Component } from 'react';

class Header extends Component {
	render() {
		return (
			<header className="header">
				<h1>Scotch<span> Distilleries</span></h1>
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
