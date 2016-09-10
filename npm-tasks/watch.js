const npmConfig = require('../npm.config.js');
const shell     = require('shelljs');
const watch     = require('watch');
const chalk     = require('chalk');

function watchTask() {
	let config = [
		{
			path  : npmConfig.source.styles,
			files : '**/*.scss',
			task  : 'npm run sass -- dev'
		},
		{
			path  : npmConfig.source.scripts,
			files : '**/*.js',
			task  : 'npm run browserify -- dev'
		},
		{
			path  : npmConfig.source.assets,
			files : '**/*',
			task  : 'npm run copy -- dev'
		},
		{
			path  : npmConfig.source.data,
			files : '**/*',
			task  : 'npm run copy -- dev'
		},
		{
			path  : npmConfig.source.html,
			files : '**/*',
			task  : 'npm run copy -- dev'
		}
	];

	for (let item of config) {
		createMonitors(item.path, item.files, item.task);
	};
};

function createMonitors(path, files, task) {
	let options = {
		ignoreDotFiles: true
	};

	watch.createMonitor(path, options, function(monitor) {
		monitor.files[files];
		monitor.on('created', function(f, stat) {
			console.log(chalk.cyan('File created: ') + chalk.magenta(f));
			shell.exec(task);
		});
		monitor.on('changed', function(f, curr, prev) {
			console.log(chalk.cyan('File changed: ') + chalk.magenta(f));
			shell.exec(task);
		});
		monitor.on('removed', function(f, stat) {
			console.log(chalk.cyan('File removed: ') + chalk.magenta(f));
			shell.exec(task);
		});
	});
};

watchTask();
