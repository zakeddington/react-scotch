const npmConfig = require('../npm.config.js');
const copyfiles = require('copyfiles');

const env = process.argv[2];

function copyTask() {

	let srcImages = npmConfig.source.images + '**/*';
	let envImages = npmConfig[env].images;

	let srcData   = npmConfig.source.data + '**/*';
	let envData   = npmConfig[env].assets;

	let srcHtml   = npmConfig.source.html + '**/*';
	let envHtml   = npmConfig[env].root;

	copyfiles([srcImages, envImages], 3, function() {});
	copyfiles([srcData,   envData],   1, function() {});
	copyfiles([srcHtml,   envHtml],   2, function() {});
};

copyTask();
