/**
 * BreakpointChange
 * @description  Create pseudo 'breakpointChange' event
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';

const BreakpointChange = function() {

	var $elIndicator = $('<div></div>',{
		'id': 'breakpoint-indicator'
	}).appendTo($('body'));

	var zIndex = $elIndicator.css('z-index');
	AppConfig.breakpoint = AppConfig.breakpoints[zIndex];

	$(window).on('resize', function(event) {
		var newZI = $elIndicator.css('z-index');
		if (newZI !== zIndex) {
			zIndex = newZI;

			AppConfig.breakpoint = AppConfig.breakpoints[zIndex];

			$.event.trigger( AppEvents.BREAKPOINT_CHANGE, {breakpoint: AppConfig.breakpoints[zIndex]} );
		}
	});

};

export default BreakpointChange;