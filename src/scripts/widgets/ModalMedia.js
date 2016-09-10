/**
 * Photo/Video Modal Window
 *
 * @description
 * - Display Photo/Video in a modal window
 * - Photo/Video is referenced via data attr on trigger
 *
 * @requires ModalWindow (base class)
 * @requires jQuery imagesLoaded plugin
 * @requires Handlebars (and template)
 *
 * @example
 * new ModalWindow($('.modal-photo-trigger'), {options})
 *
 * @constructor
 * @author     Zak Eddington <zak.eddington@wearepop.com>
 *
 * @param {String} triggerSelector  - trigger element (e.g. ".modal-photo-trigger")
 * @param {Object} objOptions       - Optional object of properties to mixin to the instance
 *
 */

import tplModalMedia from 'templates/modal-media.hbs';
import ModalWindow   from 'widgets/ModalWindow';

class ModalMedia extends ModalWindow {

	initialize( selectorTrigger, objOptions ) {
		/**
		 * Default configuration for component
		 */
		this.options = $.extend({
			type            : null,           // 'video' or 'photo'
			dataAttrMedia   : 'media-path',   // data attr of photo/video path on trigger
			template        : tplModalMedia,
			modalID         : 'modal-media'
		}, objOptions || {});

		super.initialize( selectorTrigger, this.options );
	}

	_getContent() {
		this._setContent();
	}

	/**
	 * Fired from _openModal
	 * Display the content in the modal window
	 */
	_setContent() {
		var gridContent = this.ui.curTrigger.children();
		var mediaHtml;
		var data = {
				type      : this.options.type,
				mediaPath : this.ui.curTrigger.data( this.options.dataAttrMedia )
			};

		// Create modal content container
		this.ui.content = $('<div/>', {
			'class': this.options.contentClass
		}).appendTo( this.ui.modal );

		mediaHtml = this.options.template( data );

		this.ui.content.append( mediaHtml );

		gridContent.clone().appendTo( this.ui.content );

		this.ui.content.appendTo( this.ui.modal );
	}
}

export default ModalMedia;