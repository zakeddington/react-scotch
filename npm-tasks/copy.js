const npmConfig = require('../npm.config.js');
const copyfiles = require('copyfiles');

const env = process.argv[2];

function copyTask() {
	let srcFonts  = npmConfig.source.fonts + '**/*';
	let envFonts  = npmConfig[env].fonts;

	let srcImages = npmConfig.source.images + '**/*';
	let envImages = npmConfig[env].images;

	let srcVideos = npmConfig.source.videos + '**/*';
	let envVideos = npmConfig[env].videos;

	let srcData   = npmConfig.source.data + '**/*';
	let envData   = npmConfig[env].assets;

	let srcHtml   = npmConfig.source.html + '**/*';
	let envHtml   = npmConfig[env].root;

	copyfiles([srcFonts,  envFonts],  3, function() {});
	copyfiles([srcImages, envImages], 3, function() {});
	copyfiles([srcVideos, envVideos], 3, function() {});
	copyfiles([srcData,   envData],   1, function() {});
	copyfiles([srcHtml,   envHtml],   2, function() {});
};

copyTask();
