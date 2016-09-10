/**
 * ScrollEndEvent
 * @description  Create pseudo 'scrollEnd' event
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */

import AppEvents from 'config/AppEvents';

const ScrollEndEvent = function() {
	var timer = false;
	$(window).on('scroll', function(e) {
		clearTimeout(timer);
		timer = setTimeout(function() {
			$.event.trigger( AppEvents.WINDOW_SCROLL_END );
		},200);
	});
};

export default ScrollEndEvent;