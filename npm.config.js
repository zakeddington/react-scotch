const npmConfig = {
	assetName      : 'application',
	port           : 8001,
	browsers       : ['last 2 versions', 'ie 9'],
	sasslintConfig : '.sass-lint.yml',
	source : {
		root       : 'src/',
		assets     : 'src/assets/',
		fonts      : 'src/assets/fonts',
		images     : 'src/assets/images/',
		videos     : 'src/assets/videos',
		data       : 'src/data/',
		styles     : 'src/styles/',
		scripts    : 'src/scripts/',
		vendor     : 'src/vendor/',
		html       : 'src/html/',
		includes   : 'src/html/_includes/'
	},
	dev : {
		root       : '_builds/local/',
		assets     : '_builds/local/assets/',
		fonts      : '_builds/local/assets/fonts',
		images     : '_builds/local/assets/img/',
		videos     : '_builds/local/assets/videos',
		data       : '_builds/local/assets/data/',
		styles     : '_builds/local/assets/css/',
		scripts    : '_builds/local/assets/js/'
	},
	dist : {
		root       : '_builds/public/',
		assets     : '_builds/public/assets/',
		fonts      : '_builds/public/assets/fonts',
		images     : '_builds/public/assets/img/',
		videos     : '_builds/public/assets/videos',
		data       : '_builds/public/assets/data/',
		styles     : '_builds/public/assets/css/',
		scripts    : '_builds/public/assets/js/'
	},
	includeReplace : {
		imgPath    : '/assets/img',
		navHome    : '',
		navAbout   : ''
	}
}
module.exports = npmConfig;
