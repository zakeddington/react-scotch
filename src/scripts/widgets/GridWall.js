/**
 * Grid Wall
 *
 * @description
 * - Display wall of images, videos, tweets and POPstars
 * - Open detail view of each item in a modal
 *
 * @requires jQuery
 * @requires AppEvents
 *
 * @example
 * new GridWall($('.grid-wall'), {options})
 *
 * @constructor
 * @author     Zak Eddington <zak.eddington@wearepop.com>
 *
 * @param {String} containerSelector  - container element (e.g. ".grid-wall")
 * @param {Object} objOptions         - Optional object of properties to mixin to the instance
 *
 */

import AppEvents  from 'config/AppEvents';
import AjaxGet    from 'utilities/AjaxGet';
// import AjaxPost   from 'utilities/AjaxPost';
import Loader     from 'utilities/Loader';
import ModalMedia from 'widgets/ModalMedia';
import ModalText  from 'widgets/ModalText';
import tplGrid    from 'templates/grid.hbs';

class GridWall {

	constructor( containerSelector, objOptions ) {
		this.initialize( containerSelector, objOptions );
	}

	initialize( containerSelector, objOptions ) {
		/**
		 * Default configuration for component
		 */
		this.options = $.extend({
			dataAPIs : [
				{
					url       : "/assets/data/photos.json",
					type      : 'JSON',
					apiUtil   : AjaxGet
				},
				{
					url       : "/assets/data/videos.json",
					type      : 'JSON',
					apiUtil   : AjaxGet
				},
				{
					url       : "/assets/data/tweets.json",
					type      : 'JSON',
					apiUtil   : AjaxGet
				},
				{
					url       : "/assets/data/popstars.json",
					type      : 'JSON',
					apiUtil   : AjaxGet
				}
			],
			maxItems          : {
									photos      : 32,    // max photos to display
									videos      : 0,     // max videos to display
									tweets      : 0,     // max tweets to display
									popstars    : 8,     // max popstars to display
									total       : 40,    // max items to display period.
									media       : null,  // total photo/video items (calculated below)
								},
			selectorItem      : '.grid-wall--item',    // selector for each grid item
			dataAttrType      : 'type',                // data attr on item for which data set it belongs to
			classHidden       : 'is-hidden',           // class for setting hidden states
			timerSpeed        : 2000,                  // (ms) time between randomly replacing items
			animFadeSpeed     : 0.4,                   // (s) TweenMax animation speed for initial fade in
			animFadeEase      : 'Quad.easeOut',        // TweenMax animation ease for initial fade in
			animFlipSpeed     : 0.2,                   // (s) TweenMax animation speed for flip replace
			animFlipEase      : 'Linear.easeNone',     // TweenMax animation ease for flip replace
			animDelay         : 0.1,                   // (s) animation delay between items
			assetPath         : '/assets/img/photos/', // path to the image assets used for preload
		}, objOptions || {});

		this.options.maxItems.media = this.options.maxItems.photos + this.options.maxItems.videos;

		/**
		 * UI elements
		 */
		this.ui = {
			document          : $(document),
			window            : $(window),
			body              : $('body'),
			container         : null
		};

		/**
		 * Values specific to current grid wall
		 */
		this.instance = $.extend({
			template          : tplGrid,               // Handlebars template for grid wall
			contentLoader     : null,                  // placeholder for global loading icon utility
			data              : {
									initialSet  : [],  // initial data to display
									media       : [],  // all photo/video data items
									tweets      : [],  // all tweet data items
									popstars    : []   // all popstar data items
								},
			timer             : null                   // placeholder for requestAnimationFrame for replacing items
		}, this.instance || {});

		/**
		 * Widget states
		 */
		this.state = {
			lastTypeRemoved   : 'media',               // 'media', 'tweet', 'popstar'
			curTime           : null,                  // placeholder for requestAnimationFrame time
			curIndex          : {
									media       : 0,   // next photo/video to display
									tweets      : 0,   // next tweet to display
									popstars    : 0    // next popstar to display
								}
		};

		this._initialize( containerSelector );
		this._addEventListeners();
	}

	/**
	 * Initializes the widget
	 */
	_initialize( containerSelector ) {
		this.ui.container = $( containerSelector );

		CSSPlugin.defaultTransformPerspective = 1000;

		// set global loader utility
		this.instance.contentLoader = new Loader( this.ui.container );
		this.instance.contentLoader.addLoader();

		this._getContent();
		this._initModals();
	}

	/**
	 * Create our modal widgets for each type of content
	 */
	_initModals() {
		new ModalText( '.modal-text-trigger', {
				modalClass : 'modal-window text'
			});

		new ModalMedia( '.modal-video-trigger', {
				type       : 'video',
				modalClass : 'modal-window media'
			});

		new ModalMedia( '.modal-photo-trigger', {
				type       : 'photo',
				modalClass : 'modal-window media'
			});
	}

	/**
	 * Get all our data from API calls
	 * Combine photos/videos into one array
	 * Then randomize each array and display initial grid items
	 */
	_getContent() {
		var self          = this;
		var	arrayPromises = [];

		for ( let dataAPI of this.options.dataAPIs ) {
			arrayPromises.push(
				dataAPI.apiUtil( dataAPI.url, dataAPI.type )
			);
		}

		this._deferPromises( arrayPromises ).then( function( results ) {
			for ( let result of results ) {

				if ( result.photos && self.options.maxItems.photos > 0 ) {
					self.instance.data.media = self.instance.data.media.concat( result.photos );
				}

				if ( result.videos && self.options.maxItems.videos > 0 ) {
					self.instance.data.media = self.instance.data.media.concat( result.videos );
				}

				if ( result.tweets && self.options.maxItems.tweets > 0 ) {
					self.instance.data.tweets = result.tweets;
				}

				if ( result.popstars && self.options.maxItems.popstars > 0 ) {
					self.instance.data.popstars = result.popstars;
					self._createShortDesc( self.instance.data.popstars );
				}
			}

			self._shuffleData( self.instance.data.media );
			self._shuffleData( self.instance.data.tweets );
			self._shuffleData( self.instance.data.popstars );

			self._setInitialResults();
		});
	}

	/**
	 * Copy/Truncate Popstar descriptions
	 * @param  {Array} data - JSON of popstars
	 */
	_createShortDesc( data ) {
		for ( let i in data ) {
			if ( data[i] ) {
				data[i].shortDesc = data[i].description;

				if ( data[i].shortDesc.length > 80 ) {
					data[i].shortDesc = data[i].shortDesc.substring(0, 80);
					data[i].shortDesc += '...';
				}
			}
		}
	}

	/**
	 * Defer promises utility
	 * Process all the requests while skipping over any that fail
	 * @param  {Array} arrPromises - array of promises to resolve
	 * @return {Object} promise of all the data returned
	 */
	_deferPromises( arrPromises ) {
		var deferred     = $.Deferred();
		var results      = [];
		var remaining    = arrPromises.length;
		var alwaysMethod = function() {
			// always mark as finished
			remaining--;
			// call it a day, when no more promises are left
			if ( !remaining ) {
				deferred.resolve( results );
			}
		};

		for ( let i in arrPromises ) {
			if ( arrPromises[i] ) {
				arrPromises[i]
					.then( function( response ) {
						// on success, add to results
						results.push( response );
					})
					.always( function() {
						// Call a separate method to prevent eslint error
						alwaysMethod();
					});
			}
		}

		// return a promise on the remaining values
		return deferred.promise();
	}

	/**
	 * Randomize the combined data array
	 * Then display the content
	 */
	_shuffleData( data ) {
		var arrData  = data;
		var curIndex = arrData.length;
		var tempValue;
		var ranIndex;

		// While there remain elements to shuffle...
		while ( curIndex !== 0 ) {
			// Pick a remaining element...
			ranIndex  = Math.floor( Math.random() * curIndex );
			curIndex -= 1;

			// And swap it with the current element.
			tempValue         = arrData[curIndex];
			arrData[curIndex] = arrData[ranIndex];
			arrData[ranIndex] = tempValue;
		}
	}

	/**
	 * Create array of initial items to display based on max options for each type
	 * Then truffle shuffle it up before rendering it
	 */
	_setInitialResults() {
		// create a copy of each data set
		var initialMedia    = this.instance.data.media.slice(0);
		var initialTweets   = this.instance.data.tweets.slice(0);
		var initialPopstars = this.instance.data.popstars.slice(0);

		// trim each set to its max option
		if ( initialMedia.length > this.options.maxItems.media ) {
			initialMedia.length  = this.options.maxItems.media;
		}

		if ( initialTweets.length > this.options.maxItems.tweets ) {
			initialTweets.length  = this.options.maxItems.tweets;
		}

		if ( initialPopstars.length > this.options.maxItems.popstars ) {
			initialPopstars.length  = this.options.maxItems.popstars;
		}

		// combine them into one array
		this.instance.data.initialSet = this.instance.data.initialSet.concat( initialMedia );
		this.instance.data.initialSet = this.instance.data.initialSet.concat( initialTweets );
		this.instance.data.initialSet = this.instance.data.initialSet.concat( initialPopstars );

		// set the next item to display for each orig list
		this.state.curIndex.media    = initialMedia.length;
		this.state.curIndex.tweets   = initialTweets.length;
		this.state.curIndex.popstars = initialPopstars.length;

		this._shuffleData( this.instance.data.initialSet );

		if ( this.instance.data.initialSet.length > this.options.maxItems.total ) {
			this.instance.data.initialSet.length = this.options.maxItems.total;
		}

		this._displayContent();
	}

	/**
	 * Display the initial set of content
	 */
	_displayContent() {
		var self          = this;
		var content       = this.instance.data.initialSet;
		var completeCount = 0;
		var html;
		var $items;
		var $curItem;

		if ( this.instance.template ) {
			html   = this.instance.template({ items:content });
			$items = $(html).filter( this.options.selectorItem ).addClass( this.options.classHidden );
		}

		this.instance.contentLoader.removeLoader();

		this.ui.container.prepend( $items ).imagesLoaded( { background: this.options.selectorItem }, function() {
			$.each( $items, function( index ) {
				$curItem = $(this);

				// Animate item into view
				TweenMax.fromTo( $curItem, self.options.animFadeSpeed, {
					autoAlpha  : 0
				}, {
					autoAlpha  : 1,
					delay      : self.options.animDelay * index,
					ease       : self.options.animFadeEase,
					onComplete : function() {
						completeCount++;

						// Initialize the random rotation of items after grid has rendered
						if ( completeCount === $items.length ) {
							self._startTimer();
						}

						$curItem.removeAttr('style');
					}
				});

				$curItem.removeClass( self.options.classHidden );
			});
		});
	}

	_startTimer() {
		this.state.curTime = new Date().getTime();
		this._timer();
	}

	_timer() {
		var now = new Date().getTime();

		this.instance.timer = requestAnimationFrame( this._timer.bind(this) );

		if ( now - this.state.curTime > this.options.timerSpeed ) {
			this.state.curTime = now;
			this._setRotationItems();
		}
	}

	_clearTimer() {
		cancelAnimationFrame( this.instance.timer );
	}

	/**
	 * Randomly pick a grid item to replace
	 * Then set the data for the new item based on curIndex arrays
	 */
	_setRotationItems() {
		var ranIndex     = Math.floor( Math.random() * (this.options.maxItems.total + 1) );
		var $origItem    = this.ui.container.find( this.options.selectorItem ).eq( ranIndex );
		var origItemType = $origItem.data( this.options.dataAttrType );
		var dataNewItem  = [];

		// Check which type of item was removed last time
		// Replace it with a similar item to keep the max items consistent
		// Update the lastTypeRemoved with randomly selected item
		switch( this.state.lastTypeRemoved ) {
			case 'tweets':
				if ( this.state.curIndex.tweets >= this.instance.data.tweets.length ) {
					this.state.curIndex.tweets = 0;
				}
				dataNewItem.push( this.instance.data.tweets[ this.state.curIndex.tweets ] );
				this.state.curIndex.tweets++;

				break;

			case 'popstars':
				if ( this.state.curIndex.popstars >= this.instance.data.popstars.length ) {
					this.state.curIndex.popstars = 0;
				}
				dataNewItem.push( this.instance.data.popstars[ this.state.curIndex.popstars ] );
				this.state.curIndex.popstars++;

				break;

			default:
				if ( this.state.curIndex.media >= this.instance.data.media.length ) {
					this.state.curIndex.media = 0;
				}
				dataNewItem.push( this.instance.data.media[ this.state.curIndex.media ] );
				this.state.curIndex.media++;
		}

		this.state.lastTypeRemoved = origItemType;


		this._replaceItem( $origItem, dataNewItem );
	}

	/**
	 * Replace a grid item with a new one
	 * @param  {Object} $origItem   - jQuery element to replace
	 * @param  {Array}  dataNewItem - JSON data for new element
	 */
	_replaceItem( $origItem, dataNewItem ) {
		var self     = this;
		var html     = this.instance.template({ items:dataNewItem });
		var $newItem = $( html ).filter( this.options.selectorItem ).addClass( this.options.classHidden );
		var newObj   = dataNewItem[0];
		var newImg;

		// If we're a photo, try to preload us
		if ( newObj.type === "photo" ) {
			newImg     = new Image();
			newImg.src = this.options.assetPath + newObj.image;
		}

		// Flip the card
		TweenMax.to( $origItem, this.options.animFlipSpeed, {
			rotationY  : 90,
			z          : 100,
			ease       : this.options.animFlipEase,
			onComplete : function() {
				$origItem.replaceWith( $newItem );

				TweenMax.fromTo( $newItem, self.options.animFlipSpeed, {
					rotationY  : -90,
					z          : 100
				}, {
					rotationY  : 0,
					z          : 0,
					ease       : self.options.animFlipEase,
					onComplete : function() {
						$newItem.removeAttr('style');
					}
				});
			}
		});

		$newItem.removeClass( self.options.classHidden );
	}

	_addEventListeners() {
		this.ui.window.on( AppEvents.MODAL_EVENT + ':preOpenModal', this._clearTimer.bind(this) );
		this.ui.window.on( AppEvents.MODAL_EVENT + ':ModalClosed',  this._startTimer.bind(this) );
	}
}

export default GridWall;
