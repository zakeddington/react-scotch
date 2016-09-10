/**
 * ResizeEndEvent
 * @description  Create pseudo 'resizeEnd' event
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */

import AppEvents from 'config/AppEvents';

const ResizeEndEvent = function() {
	var timer = false;
	$(window).on('resize', function(e) {
		clearTimeout(timer);
		timer = setTimeout(function() {
			$.event.trigger( AppEvents.WINDOW_RESIZE_END );
		},200);
	});
};

export default ResizeEndEvent;