/**
 * Debounce
 * @description
 * Delay function execution based on Underscore debounce method
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */

const Debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this;
		var args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
};

export default Debounce;
