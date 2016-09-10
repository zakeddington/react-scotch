const npmConfig = require('../npm.config.js');
const uglify    = require('uglify-js');
const filerw    = require('file-rw');
const chalk     = require('chalk');

const env = process.argv[2];

function concatTask() {
	let srcPath  = npmConfig.source.vendor;
	let envPath  = npmConfig[env].scripts + 'vendor.js';
	let srcFiles = [
		srcPath + 'jquery.js',
		srcPath + 'imagesloaded.pkgd.js',
		srcPath + 'TweenMax.js',
	];

	let result = uglify.minify(srcFiles, {
		mangle   : true,
		compress : {
			sequences    : true,
			dead_code    : true,
			conditionals : true,
			booleans     : true,
			unused       : true,
			if_return    : true,
			join_vars    : true,
			drop_console : true
		}
	});

	filerw.mkWriteFile(envPath, result.code, function(error, success) {
		if (error) {
			throw error;
		} else {
			console.log(chalk.cyan('File created: ') + chalk.magenta(envPath));
		}
	});
};

concatTask();