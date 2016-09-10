/**
 * AppEvents
 * @description  Defines events for application
 *
 * @global
 * @author       Zak Eddington <zak.eddington@wearepop.com>
 */
const AppEvents = {

	// global events
	WINDOW_RESIZE_END   : 'onWindowResizeEnd',
	WINDOW_SCROLL_END   : 'onWindowScrollEnd',
	BREAKPOINT_CHANGE   : 'onBreakpointChange',

	// specific events
	CUSTOM_EVENT        : 'onCustomEvent',
	MODAL_EVENT         : 'onModalEvent'

};

export default AppEvents;