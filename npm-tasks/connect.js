const npmConfig   = require('../npm.config.js');
const browserSync = require('browser-sync');

function connectTask() {
	let srcPath = npmConfig.source.root + '**/*';
	let envPath = npmConfig.dev.root;

	browserSync({
		port   : npmConfig.port,
		files  : envPath,
		open   : false,
		server : {
			baseDir : envPath,
			index   : 'index.html'
		}
	}, function(err, bs) {
		console.log(bs.options.getIn(['urls', 'local']));
	});
};

connectTask();
