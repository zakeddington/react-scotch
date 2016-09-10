/**
 * Modal Window
 *
 * @description
 * - Display content (href target) in a modal window
 *
 * @requires jQuery
 * @requires AppEvents
 *
 * @example
 * new ModalWindow($('.modal-trigger'), {options})
 *
 * @constructor
 * @author     Zak Eddington <zak.eddington@wearepop.com>
 *
 * @param {String} triggerSelector  - trigger element (e.g. ".modal-trigger")
 * @param {Object} objOptions       - Optional object of properties to mixin to the instance
 *
 */

import AppEvents from 'config/AppEvents';
import Loader    from 'utilities/Loader';

class ModalWindow {

	constructor( triggerSelector, objOptions ) {
		this.initialize( triggerSelector, objOptions );
	}

	initialize( triggerSelector, objOptions ) {

		/**
		 * Default configuration for component
		 */
		this.options = $.extend({
			ariaHideElements  : '#wrapper, body > iframe',   // elements to add attribute aria-hidden=true when modal is open
			modalID           : 'modal',                     // id of the modal window container
			modalClass        : 'modal-window',              // class of the modal window container
			contentClass      : 'modal-content',             // class of the content container in the modal
			modalOverlayID    : 'modal-overlay',             // id of the overlay
			closeBtnClass     : 'modal-close',               // class of the close button
			closeBtnText      : 'close modal window',        // inner text and title attribute of the close button
			activeClass       : 'active',                    // class for setting active states
			customEventPrfx   : AppEvents.MODAL_EVENT        // name for modal events
		}, objOptions || {});

		/**
		 * UI elements
		 */
		this.ui = {
			document          : $(document),
			window            : $(window),
			body              : $('body'),
			triggers          : null,
			curTrigger        : null,
			modal             : null,
			content           : null,
			closeButton       : null,
			overlay           : null,
			ariaHideElements  : null
		};

		/**
		 * Values specific to current modal window instance
		 */
		this.instance = $.extend({
			namespace         : null,     // dynamically created namespace for this instance
			contentLoader     : null,     // placeholder for global loading icon utility
			cacheContent      : []        // placeholder for caching modal content
		}, this.instance || {});

		/**
		 * Widget states
		 */
		this.state = {
			isOpen            : false,    // is the modal open
			curIndex          : null,     // current index of the trigger element
			winScrollTop      : null
		};

		this._initialize( triggerSelector );
	}

	/**
	 * Initializes the widget
	 */
	_initialize( triggerSelector ) {
		this.ui.triggers = $( triggerSelector );

		// create overlay if it doesn't exist
		this.ui.overlay = $('#' + this.options.modalOverlayID);
		if (!this.ui.overlay.length) {
			this.ui.overlay = $('<div></div>',{
				'id': this.options.modalOverlayID
			}).appendTo(this.ui.body).attr('tabindex', 0);
		}

		// create modal container if it doesn't exist
		this.ui.modal = $('#' + this.options.modalID);
		if (!this.ui.modal.length) {
			this.ui.modal = $('<div/>', {
				'id': this.options.modalID,
				'class': this.options.modalClass,
				'tabindex': '-1'
			}).insertBefore( this.ui.overlay )/*.hide()*/;
		}

		// non modal elements that need to be hidden from screen readers when modal is open
		this.ui.ariaHideElements = $( this.options.ariaHideElements );

		// set namespace for this instance of the modal window
		this.instance.namespace = Date.now();

		// set global loader utility
		this.instance.contentLoader = new Loader( this.ui.modal );

		// add event handlers to trigger elements
		this.addTriggerEvents( triggerSelector );
	}

	/**
	 * Add event handlers to trigger elements
	 */
	addTriggerEvents( triggerSelector ) {
		this.ui.body.on('click.' + this.instance.namespace, triggerSelector, $.proxy(this._onTriggerClick, this));
	}

	/**
	 * Remove event handlers on trigger elements
	 */
	removeTriggerEvents() {
		this.ui.body.off('click.' + this.instance.namespace);
	}

	/**
	 * Set the current trigger element and its index
	 * Then open the modal
	 */
	_onTriggerClick( event ) {
		event.preventDefault();

		this.ui.curTrigger = $( event.currentTarget );

		this.state.curIndex = this.ui.triggers.index( this.ui.curTrigger );

		this._openModal();
	}

	/**
	 * Start all actions to open modal window
	 */
	_openModal() {
		// Fire custom event
		$.event.trigger( this.options.customEventPrfx + ':preOpenModal' );

		this.state.winScrollTop = this.ui.window.scrollTop();

		if ( !this.ui.body.hasClass('modal-open') ) {
			this.ui.body.addClass('modal-open').css({position: 'fixed', top: this.state.winScrollTop * -1});
		}
		this.ui.modal.attr( 'aria-hidden', 'false' );
		this.ui.ariaHideElements.attr( 'aria-hidden', 'true' );

		this.instance.contentLoader.addLoader();

		this.ui.overlay.show();
		// this.ui.modal.show();

		this._addEventHandlers();
		this._getContent();

		// Set open bool
		this.state.isOpen = true;

		// Set focus and fade in content
		this.instance.contentLoader.removeLoader();
		this.ui.overlay.addClass( this.options.activeClass );
		this.ui.modal.addClass( this.options.activeClass );

		this.ui.closeButton.focus();

		// Fire custom event
		$.event.trigger( this.options.customEventPrfx + ':modalOpened' );
	}

	/**
	 * Start all actions to close modal window
	 */
	_closeModal() {
		var self = this;

		this.ui.window.scrollTop(this.state.winScrollTop);

		if ( this.ui.body.hasClass('modal-open') ) {
			this.ui.body.removeClass('modal-open').removeAttr('style');
		}
		this.ui.modal.attr( 'aria-hidden', 'true' );
		this.ui.ariaHideElements.attr( 'aria-hidden', 'false' );

		this.ui.overlay.hide();
		// this.ui.modal.hide();

		this._removeEventHandlers();

		// Reset focus, remove content and fire custom event
		this.ui.overlay.removeClass( this.options.activeClass ).removeAttr('style');
		this.ui.modal.removeClass( this.options.activeClass ).removeAttr('style');
		this.ui.curTrigger.focus();
		this.state.isOpen = false;

		self.ui.modal.empty();

		$.event.trigger( this.options.customEventPrfx + ':ModalClosed' );
	}

	/**
	 * Add all modal interaction handlers, namespaced to this instance
	 */
	_addEventHandlers() {
		var self = this;

		this.ui.closeButton = $('<a />');
		this.ui.closeButton.addClass( this.options.closeBtnClass );
		this.ui.closeButton.attr('href', '#close');
		this.ui.closeButton.attr('title', this.options.closeBtnText );
		this.ui.closeButton.text( this.options.closeBtnText );
		this.ui.closeButton.append(
			'<span class="item one-1"></span>' +
			'<span class="item one-2"></span>' +
			'<span class="item one-3"></span>' +
			'<span class="item two-1"></span>' +
			'<span class="item two-2"></span>' +
			'<span class="item two-3"></span>' +
			'<span class="item three-1"></span>' +
			'<span class="item three-2"></span>' +
			'<span class="item three-3"></span>'
		);
		this.ui.modal.prepend( this.ui.closeButton );
		this.ui.modal.on('click.' + this.instance.namespace, '.' + this.options.closeBtnClass, $.proxy(this._onCloseBtnClick, this));

		this.ui.overlay.on('click.' + this.instance.namespace, function() {
			if ( self.state.isOpen ) {
				self._closeModal();
			}
		});

		this.ui.window.on('keydown.' + this.instance.namespace, $.proxy(this._onWindowKeydown, this));
		this.ui.window.on('resize.'  + this.instance.namespace, $.proxy(this._onWindowResize, this));

		this.ui.document.on('focusin.' + this.instance.namespace, function( event ) {
			// If modal is open and the focus leaves the modal
			if ( self.state.isOpen && !self.ui.modal.find( $(event.target) ).length ) {
				// Return focus to the close button
				self.ui.closeButton.focus();
			}
		});
	}

	/**
	 * Remove all modal interaction handlers attached to this instance
	 */
	_removeEventHandlers() {
		this.ui.document.off('.' + this.instance.namespace);
		this.ui.window.off('.' + this.instance.namespace);
		this.ui.modal.off('.' + this.instance.namespace);
		this.ui.overlay.off('.' + this.instance.namespace);
	}

	/**
	 * Close popup when clicking close button
	 */
	_onCloseBtnClick( event ) {
		event.preventDefault();
		this._closeModal();
	}

	/**
	 * Close popup on ESC key down
	 */
	_onWindowKeydown( event ) {
		if ( event.keyCode === 27 && this.state.isOpen ) {
			this._closeModal();
		}
	}

	/**
	 * Center the popup and resize the overlay
	 */
	_onWindowResize( event ) {
		if ( this.state.isOpen ) {

		}
	}

	/**
	 * Fired from _openModal
	 * This function gets overwritten in sub class modals
	 */
	_getContent() {
		var target = $( this.ui.curTrigger.attr('href') );
		this._setContent( target );
	}

	/**
	 * Fired from _getContent
	 * Display the content in the modal window
	 * This function gets overwritten in sub class modals
	 * @param {Object}  content - jQuery element
	 */
	_setContent( content ) {
		this.ui.content = content.clone().appendTo( this.ui.modal );
	}
}

export default ModalWindow;
