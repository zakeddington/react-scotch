const npmConfig = require('../npm.config.js');
const rimraf    = require('rimraf');

const env = process.argv[2];

function cleanTask() {
	let envPath = npmConfig[env].root;

	rimraf(envPath, [], function() {});
};

cleanTask();
