import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './application';
import Home from './components/Home';

render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} region='Speyside' />
			<Route path="highlands" component={Home} region='Highlands' />
			<Route path="speyside" component={Home} region='Speyside' />
			<Route path="*" component={Home} region='Speyside' />
		</Route>
	</Router>,
	document.getElementById('app')
);
