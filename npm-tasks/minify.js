const npmConfig = require('../npm.config.js');
const uglify    = require('uglify-js');
const filerw    = require('file-rw');
const chalk     = require('chalk');

function minifyTask() {
	let envPath = npmConfig.dist.scripts + npmConfig.assetName + '.js';

	let result = uglify.minify(envPath, {
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
			console.log(chalk.cyan('File minified: ') + chalk.magenta(envPath));
		}
	});
};

minifyTask();