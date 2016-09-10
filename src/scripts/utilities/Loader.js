/**
 * Loader
 * @description  Global loading icon
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */

class Loader {
	constructor( $target, objOptions ) {
		this.$target = $target;
		this.options = $.extend({
			overlay: '<div class="loader-overlay"></div>',
			spinner: '<div class="loader-spinner"></div>'
		}, objOptions || {});
		this.$overlay = $(this.options.overlay);
		this.$spinner = $(this.options.spinner);
	}
	addLoader() {
		this.$overlay.append(this.$spinner);
		this.$target.append(this.$overlay);
	}
	removeLoader() {
		this.$overlay.remove();
	}
}

export default Loader;