const npmConfig          = require('../npm.config.js');
const path               = require('path');
const filerw             = require('file-rw');
const fs                 = require('fs');
const readDir            = require('fs-readdir-recursive');
const escapeStringRegExp = require('escape-string-regexp');
const chalk              = require('chalk');

const env = process.argv[2];

/**
 * How to use this in real life
 *
 * ----
 *
 * To include an entire file (header, footer, etc)
 * @@include("filename.html")
 *
 * ----
 *
 * To include a specific string value defined in npm.config.js
 * Use the includeReplace object for definitions
 * npmConfig = {
 *   ...
 *   includeReplace : {
 *     imgPath : '/assets/img'
 *   }
 * }
 *
 * And reference it using @@propertyName
 * <img src="@@imgPath/someimage.jpg" />
 *
 * ----
 *
 * To include a custom value for a config property on a page by page basis (active nav class, etc)
 * Add the original definition in the includeReplace object in npm.config.js
 * npmConfig = {
 *   ...
 *   includeReplace : {
 *     imgPath : '/assets/img',
 *     navHome : ''
 *   }
 * }
 *
 * Then redefine it in the html file using @@config
 * @@config({
 *   "navHome" : "isActive"
 * })
 */


/**
 * Init our task
 */
function includeReplaceTask() {
	let srcHtmlPath = npmConfig.source.html;

	getHtmlFiles(srcHtmlPath);
};

/**
 * Find all html files in the src directory
 * @param  {String} dirName - src directory path
 */
function getHtmlFiles(dirName) {
	// Exclude . files (.DS_Store, etc) and _ files (_includes directory)
	let htmlFileNames = readDir(dirName, function(strFileName) {
		if (strFileName[0] === '.' || strFileName[0] === '_') {
			return false;
		} else {
			return true;
		}
	});

	// Get the html content of each file so we can start replacing stuff
	htmlFileNames.forEach(function(htmlFileName) {
		let htmlContent = getFileContent(dirName + htmlFileName);
		replaceIncludes(htmlFileName, htmlContent)
	});
};

/**
 * Utility for getting the html content of a file as a string
 * @param  {String} filePath - src file path
 * @return {String}          - html content
 */
function getFileContent(filePath) {
	let content = fs.readFileSync(filePath, 'utf-8', function(error, content) {
		if (error) {
			throw error;
			return;
		}
	});

	return content;
};

/**
 * Replace all @@include references with the content from the specified file
 * @param  {String} htmlFileName - src path of the primary page
 * @param  {String} htmlContent  - html content of the primary page
 */
function replaceIncludes(htmlFileName, htmlContent) {
	let regEx        = /@@include\(\"(.*?)\"\)/g; // the filename inside parenthesis @@include("")
	let origContent  = htmlContent;
	let includePaths = [];
	let curMatch;
	let newContent;

	// Add all filenames to includePaths array
	while (curMatch = regEx.exec(origContent)) {
		if (includePaths.indexOf(curMatch[1]) === -1) {
			includePaths.push(curMatch[1]);
		}
	}

	// Replace all @@include references with the actual html of that file
	includePaths.forEach(function(includePath) {
		let includeContent = getFileContent(npmConfig.source.includes + includePath);

		let regEx = new RegExp(escapeStringRegExp('@@include("' + includePath + '")'), 'g');

		newContent  = origContent.replace(regEx, includeContent);
		origContent = newContent;
	});

	// Move on to the config values
	replaceConfig(htmlFileName, newContent);
};

/**
 * Check for any custom config values that need to be used
 * @param  {String} htmlFileName - src path of the primary page
 * @param  {String} htmlContent  - html content of the primary page
 */
function replaceConfig(htmlFileName, htmlContent) {
	let regEx        = /@@config\(([^)]+)\)/gim;       // the object inside @@config()
	let origConfig   = npmConfig.includeReplace;       // includeReplace object in npm.config.js
	let origContent  = htmlContent;
	let customConfig = regEx.exec(origContent);        // get our custom object
	let newConfig    = Object.assign({}, origConfig);  // clone our original npm.config.js object
	let newContent   = origContent.replace(regEx, ''); // remove @@config reference in the markup

	if (customConfig) {
		// @@config object is actually a string so we need to convert it
		customConfig = JSON.parse(customConfig[1]);

		// Merge our custom values into local copy of the config
		for (var key in customConfig) {
			newConfig[key] = customConfig[key];
		}
	}

	// Move on to replace all these values
	replaceTags(htmlFileName, newContent, newConfig);
};

/**
 * Replace all config values in the page
 * @param  {String} htmlFileName  - src path of the primary page
 * @param  {String} htmlContent   - html content of the primary page
 * @param  {Object} configOptions - config values to replace
 */
function replaceTags(htmlFileName, htmlContent, configOptions) {
	let prefix      = '@@';
	let origContent = htmlContent;
	let newContent;
	let config;

	// Use the custom values if they exist
	// Otherwise, fallback to the global definitions
	if (configOptions) {
		config = configOptions;
	} else {
		config = npmConfig.includeReplace;
	}

	// Replace all @@ references
	for (let prop in config) {
		let regEx = new RegExp(escapeStringRegExp(prefix + prop), 'g');

		newContent  = origContent.replace(regEx, config[prop]);
		origContent = newContent;
	}

	// Finish up
	writeNewFile(htmlFileName, newContent);
};

/**
 * Create the new file in the specified output directory
 * @param  {String} htmlFileName  - src path of the primary page
 * @param  {String} htmlContent   - html content of the primary page
 */
function writeNewFile(htmlFileName, htmlContent) {
	let envPath = npmConfig[env].root + htmlFileName;

	filerw.mkWriteFile(envPath, htmlContent, function(error, success) {
		if (error) {
			throw error;
		} else {
			console.log(chalk.cyan('File created: ') + chalk.magenta(envPath));
		}
	});
};

includeReplaceTask();