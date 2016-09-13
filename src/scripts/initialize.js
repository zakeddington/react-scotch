import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './application';
import Home from './components/Home';

render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} region='All' />
			<Route path="campbeltown" component={Home} region='Campbeltown' />
			<Route path="highland" component={Home} region='Highland' />
			<Route path="islands" component={Home} region='Islands' />
			<Route path="islay" component={Home} region='Islay' />
			<Route path="lowland" component={Home} region='Lowland' />
			<Route path="speyside" component={Home} region='Speyside' />
			<Route path="*" component={Home} region='All' />
		</Route>
	</Router>,
	document.getElementById('app')
);
