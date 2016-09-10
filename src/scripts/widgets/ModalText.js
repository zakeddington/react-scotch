/**
 * POPstar/Tweet Modal Window
 *
 * @description
 * - Display POPstar/Tweet content in a modal window
 * - Content is a clone of grid elements
 *
 * @requires ModalWindow (base class)
 *
 * @example
 * new ModalWindow($('.modal-popstar-trigger'), {options})
 *
 * @constructor
 * @author     Zak Eddington <zak.eddington@wearepop.com>
 *
 * @param {String} triggerSelector  - trigger element (e.g. ".modal-popstar-trigger")
 * @param {Object} objOptions       - Optional object of properties to mixin to the instance
 *
 */

import ModalWindow  from 'widgets/ModalWindow';

class ModalText extends ModalWindow {

	initialize( selectorTrigger, objOptions ) {
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
		var content = this.ui.curTrigger.children();

		// Create modal content container
		this.ui.content = $('<div/>', {
			'class': this.options.contentClass
		});

		content.clone().appendTo( this.ui.content );
		this.ui.content.appendTo( this.ui.modal );
	}
}

export default ModalText;
