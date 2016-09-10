const npmConfig    = require('../npm.config.js');
const sass         = require('node-sass');
const postcss      = require('postcss');
const autoprefixer = require('autoprefixer');
const lint         = require('sass-lint');
const filerw       = require('file-rw');
const chalk        = require('chalk');

const env = process.argv[2];

function sassTask() {
	let srcPath           = npmConfig.source.styles;
	let srcFile           = npmConfig.source.styles + npmConfig.assetName + '.scss';
	let destPath          = npmConfig[env].styles;
	let destFile          = destPath + npmConfig.assetName + '.css';
	let outputStyle       = 'compressed';
	let sourceComments    = false;
	let sourcemap         = false;
	let sourceMapContents = false;
	let sourceMapEmbed    = false;

	if (env === 'dev') {
		outputStyle       = 'expanded';
		sourceComments    = true;
		sourcemap         = true;
		sourceMapContents = true;
		sourceMapEmbed    = true;
	}

	sass.render({
		file              : srcFile,
		outFile           : destPath,
		outputStyle       : outputStyle,
		sourceComments    : sourceComments,
		sourcemap         : sourcemap,
		sourceMapContents : sourceMapContents,
		sourceMapEmbed    : sourceMapEmbed,
	}, function(error, result) {
		if (error) {
			console.log(chalk.white.underline(error.file));
			console.log(chalk.white('Line ' + error.line + ':' + error.column + ' ') + chalk.red(error.message));
		} else {
			filerw.mkWriteFile(destFile, result.css.toString(), function(error, success) {
				if (error) {
					throw error;
				} else {
					console.log(chalk.cyan('File created: ') + chalk.magenta(destFile));
					autoprefixerTask(result.css);
				}
			});
		}
	});
};

function autoprefixerTask(css) {
	let destFile = npmConfig[env].styles + npmConfig.assetName + '.css';
	let destMap  = destFile + '.map';

	autoprefixer.browsers = npmConfig.browsers;

	postcss([autoprefixer]).process(css, {
		from : destFile,
		to   : destFile
	}).then( function(result) {
		result.warnings().forEach( function(warn) {
			console.warn(warn.toString());
		});

		filerw.mkWriteFile(destFile, result.css, function(error, success) {
			if (error) {
				throw error;
			} else {
				console.log(chalk.cyan('File autoprefixed: ') + chalk.magenta(destFile));
			}
		});

		if (result.map) {
			filerw.mkWriteFile(destMap, result.map, function(error, success) {
				if (error) {
					throw error;
				} else {
					console.log(chalk.cyan('File autoprefixed: ') + chalk.magenta(destMap));
				}
			});
		}
	});
};

function sassLintTask() {
	let srcFiles     = npmConfig.source.styles + '**/*.scss';
	let results      = lint.lintFiles(srcFiles, {}, npmConfig.sasslintConfig);
	let resultCount  = lint.resultCount(results);
	let errorCount   = lint.errorCount(results);
	let resultFormat = lint.format(results);

	if (resultCount > 0) {
		lint.outputResults(results);
	} else {
		console.log(chalk.cyan('Sasstastic! You\'ve earned your Sass Lint merit badge. Go tell your friends.'));
		sassTask();
	}
};

sassLintTask();
