/**
 * AppConfig
 * @description  Defines config values for application
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */
const AppConfig = {

	/**
	 * Current breakpoint name
	 * @type {String}
	 */
	breakpoint : null,

	breakpoints: {
		1: 'mobile',
		2: 'tablet',
		3: 'desktop'
	},

	isIDevice  : (navigator.platform.indexOf('iPhone')>=0 || navigator.platform.indexOf('iPad')>=0 || navigator.platform.indexOf('iPod')>=0) ? true : false,
	hasTouch   : 'ontouchstart' in window
};

export default AppConfig;