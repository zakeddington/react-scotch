const npmConfig  = require('../npm.config.js');
const browserify = require('browserify');
const path       = require('path');
const pathmodify = require('pathmodify');
const filerw     = require('file-rw');
const chalk      = require('chalk');

const env = process.argv[2];

function browserifyTask() {
	let srcPath = npmConfig.source.scripts + npmConfig.assetName + '.js';
	let envPath = npmConfig[env].scripts   + npmConfig.assetName + '.js';

	let paths = [
		pathmodify.mod.dir('config',    path.join(__dirname, '../src/scripts/config')),
		pathmodify.mod.dir('components',path.join(__dirname, '../src/scripts/components')),
		pathmodify.mod.dir('utilities', path.join(__dirname, '../src/scripts/utilities'))
	];

	browserify(srcPath)
		.transform('babelify', {
			presets: ['es2015', 'react']
		})
		.plugin(pathmodify, {
			mods: paths
		})
		.bundle(function(error, results) {
			if (error) {
				throw error;
			} else {
				filerw.mkWriteFile(envPath, results, function(error, success) {
					if (error) {
						throw error;
					} else {
						console.log(chalk.cyan('File created: ') + chalk.magenta(envPath));
					}
				});
			}
		});
};

browserifyTask();
