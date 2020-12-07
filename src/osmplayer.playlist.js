var osmplayer = osmplayer || {};
(function(exports) {
/*!
 * iScroll Lite base on iScroll v4.1.6 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */

(function(){
var m = Math,
	mround = function (r) { return r >> 0; },
	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
		'opera' in window ? 'O' : '',

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isPlaybook = (/playbook/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor + 'Transform' in document.documentElement.style,
    hasTransitionEnd = isIDevice || isPlaybook,

	nextFrame = (function() {
	    return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback) { return setTimeout(callback, 17); }
	})(),
	cancelFrame = (function () {
	    return window.cancelRequestAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.msCancelRequestAnimationFrame
			|| clearTimeout
	})(),

	// Events
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',

	// Helpers
	trnOpen = 'translate' + (has3d ? '3d(' : '('),
	trnClose = has3d ? ',0)' : ')',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			doc = document,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: false,

			// Events
			onRefresh: null,
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];

		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform ? that.options.useTransform : false;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Set some default styles
		that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';
		that.scroller.style[vendor + 'TransitionDuration'] = '0';
		that.scroller.style[vendor + 'TransformOrigin'] = '0 0';
		if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) that._bind('mouseout', that.wrapper);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case 'mouseout': that._mouseout(e); break;
			case 'webkitTransitionEnd': that._transitionEnd(e); break;
		}
	},

	_resize: function () {
		this.refresh();
	},
	
	_pos: function (x, y) {
		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
		} else {
			x = mround(x);
			y = mround(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;
	},

	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);
		
		if (that.options.useTransition) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
				x = matrix[4] * 1;
				y = matrix[5] * 1;
			} else {
				x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
				y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind('webkitTransitionEnd');
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
			}
		}

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV);
		that._bind(END_EV);
		that._bind(CANCEL_EV);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			timestamp = e.timeStamp || Date.now();

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > 0 || newY < that.maxScrollY) { 
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= 0 || that.maxScrollY >= 0 ? 0 : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length != 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			newDuration;

		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (!that.moved) {
			if (hasTouch) {
				// Find the last touched element
				target = point.target;
				while (target.nodeType != 1) target = target.parentNode;

				if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
					ev = document.createEvent('MouseEvents');
					ev.initMouseEvent('click', true, true, e.view, 1,
						point.screenX, point.screenY, point.clientX, point.clientY,
						e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
						0, null);
					ev._fake = true;
					target.dispatchEvent(ev);
				}
			}

			that._resetPos(200);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
 			if ((that.y > 0 && newPosY > 0) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			that.scrollTo(mround(newPosX), mround(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= 0 || that.maxScrollY > 0 ? 0 : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
				that.moved = false;
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},
	
	_mouseout: function (e) {
		var t = e.relatedTarget;

		if (!t) {
			this._end(e);
			return;
		}

		while (t = t.parentNode) if (t == this.wrapper) return;
		
		this._end(e);
	},

	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind('webkitTransitionEnd');
		
		that._startAni();
	},

	/**
	 *
	 * Utilities
	 *
	 */
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;

		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}

		step = that.steps.shift();

		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;

		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind('webkitTransitionEnd');
			else that._resetPos(0);
			return;
		}
		
		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};
		
		animate();
	},

	_transitionTime: function (time) {
		this.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';
	},
	
	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries 
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: mround(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		} 

		return { left: left, top: top };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	 *
	 * Public methods
	 *
	 */
	destroy: function () {
		var that = this;

		that.scroller.style[vendor + 'Transform'] = '';

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);
		that._unbind('mouseout', that.wrapper);
		if (that.options.useTransition) that._unbind('webkitTransitionEnd');
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset;

		that.wrapperW = that.wrapper.clientWidth;
		that.wrapperH = that.wrapper.clientHeight;

		that.scrollerW = that.scroller.offsetWidth;
		that.scrollerH = that.scroller.offsetHeight;
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH;
		that.dirX = 0;
		that.dirY = 0;

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;


		that.scroller.style[vendor + 'TransitionDuration'] = '0';

		that._resetPos(200);
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > 0 ? 0 : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV);
		this._unbind(END_EV);
		this._unbind(CANCEL_EV);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	}
};

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})();
})(osmplayer);
/**
 * @constructor
 * @extends minplayer.display
 * @class This class creates the playlist functionality for the minplayer.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.playlist = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'playlist', context, options);
};

/** Derive from minplayer.display. */
osmplayer.playlist.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.playlist.prototype.constructor = osmplayer.playlist;

/**
 * Returns the default options for this plugin.
 *
 * @param {object} options The default options for this plugin.
 */
osmplayer.playlist.prototype.defaultOptions = function(options) {
  options.vertical = true;
  options.playlist = '';
  options.pageLimit = 10;
  options.autoNext = true;
  options.shuffle = false;
  options.loop = false;
  options.hysteresis = 40;
  options.scrollSpeed = 20;
  options.scrollMode = 'auto';
  minplayer.display.prototype.defaultOptions.call(this, options);
};

/**
 * @see minplayer.plugin#construct
 */
osmplayer.playlist.prototype.construct = function() {

  /** The nodes within this playlist. */
  this.nodes = [];

  // Current page.
  this.page = -1;

  // The total amount of nodes.
  this.totalItems = 0;

  // The current loaded item index.
  this.currentItem = -1;

  // The play playqueue.
  this.playqueue = [];

  // The playqueue position.
  this.playqueuepos = 0;

  // The current playlist.
  this.playlist = this.options.playlist;

  // Create the scroll bar.
  this.scroll = null;

  // Create our orientation variable.
  this.orient = {
    pos: this.options.vertical ? 'y' : 'x',
    pagePos: this.options.vertical ? 'pageY' : 'pageX',
    offset: this.options.vertical ? 'top' : 'left',
    wrapperSize: this.options.vertical ? 'wrapperH' : 'wrapperW',
    minScroll: this.options.vertical ? 'minScrollY' : 'minScrollX',
    maxScroll: this.options.vertical ? 'maxScrollY' : 'maxScrollX',
    size: this.options.vertical ? 'height' : 'width'
  };

  // Create the pager.
  this.pager = this.create('pager', 'osmplayer');
  this.pager.ubind(this.uuid + ':nextPage', (function(playlist) {
    return function(event) {
      playlist.nextPage();
    };
  })(this));
  this.pager.ubind(this.uuid + ':prevPage', (function(playlist) {
    return function(event) {
      playlist.prevPage();
    };
  })(this));

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Load the "next" item.
  this.hasPlaylist = this.next();

  // Say that we are ready.
  this.ready();
};

/**
 * @see minplayer.plugin.onAdded
 */
osmplayer.playlist.prototype.onAdded = function(plugin) {

  // Get the media.
  if (this.options.autoNext) {

    // Get the player from this plugin.
    plugin.get('player', (function(playlist) {
      return function(player) {
        player.ubind(playlist.uuid + ':player_ended', function(event) {
          if (playlist.hasPlaylist) {
            if (typeof player.options.originalAutoPlay == 'undefined') {
              player.options.originalAutoPlay = player.options.autoplay;
            }
            player.options.autoplay = true;
            playlist.next();
          }
        });
      };
    })(this));
  }
};

/**
 * Wrapper around the scroll scrollTo method.
 *
 * @param {number} pos The position you would like to set the list.
 * @param {boolean} relative If this is a relative position change.
 */
osmplayer.playlist.prototype.scrollTo = function(pos, relative) {
  if (this.scroll) {
    this.scroll.options.hideScrollbar = false;
    if (this.options.vertical) {
      this.scroll.scrollTo(0, pos, 0, relative);
    }
    else {
      this.scroll.scrollTo(pos, 0, 0, relative);
    }
    this.scroll.options.hideScrollbar = true;
  }
};

/**
 * Refresh the scrollbar.
 */
osmplayer.playlist.prototype.refreshScroll = function() {

  // Make sure that our window has the addEventListener to keep IE happy.
  if (!window.addEventListener) {
    setTimeout((function(playlist) {
      return function() {
        playlist.refreshScroll.call(playlist);
      };
    })(this), 200);
    return;
  }

  // Check the size of the playlist.
  var list = this.elements.list;
  var scroll = this.elements.scroll;

  // Destroy the scroll bar first.
  if (this.scroll) {
    this.scroll.scrollTo(0, 0);
    this.scroll.destroy();
    this.scroll = null;
    this.elements.list
        .unbind('mousemove')
        .unbind('mouseenter')
        .unbind('mouseleave');
  }

  // Need to force the width of the list.
  if (!this.options.vertical) {
    var listSize = 0;
    jQuery.each(this.elements.list.children(), function() {
      listSize += jQuery(this).outerWidth();
    });
    this.elements.list.width(listSize);
  }

  // Check to see if we should add a scroll bar functionality.
  if ((list.length > 0) &&
      (scroll.length > 0) &&
      (list[this.orient.size]() > scroll[this.orient.size]())) {

    // Setup the osmplayer.iScroll component.
    this.scroll = new osmplayer.iScroll(this.elements.scroll.eq(0)[0], {
      hScroll: !this.options.vertical,
      hScrollbar: !this.options.vertical,
      vScroll: this.options.vertical,
      vScrollbar: this.options.vertical,
      hideScrollbar: (this.options.scrollMode !== 'none')
    });

    // Use autoScroll for non-touch devices.
    if ((this.options.scrollMode == 'auto') && !minplayer.hasTouch) {

      // Bind to the mouse events for autoscrolling.
      this.elements.list.bind('mousemove', (function(playlist) {
        return function(event) {
          event.preventDefault();
          var offset = playlist.display.offset()[playlist.orient.offset];
          playlist.mousePos = event[playlist.orient.pagePos];
          playlist.mousePos -= offset;
        };
      })(this)).bind('mouseenter', (function(playlist) {
        return function(event) {
          event.preventDefault();
          playlist.scrolling = true;
          var setScroll = function() {
            if (playlist.scrolling) {
              var scrollSize = playlist.scroll[playlist.orient.wrapperSize];
              var scrollMid = (scrollSize / 2);
              var delta = playlist.mousePos - scrollMid;
              if (Math.abs(delta) > playlist.options.hysteresis) {
                var hyst = playlist.options.hysteresis;
                hyst *= (delta > 0) ? -1 : 0;
                delta = (playlist.options.scrollSpeed * (delta + hyst));
                delta /= scrollMid;
                var pos = playlist.scroll[playlist.orient.pos] - delta;
                var min = playlist.scroll[playlist.orient.minScroll] || 0;
                var max = playlist.scroll[playlist.orient.maxScroll];
                if (pos >= min) {
                  playlist.scrollTo(min);
                }
                else if (pos <= max) {
                  playlist.scrollTo(max);
                }
                else {
                  playlist.scrollTo(delta, true);
                }
              }

              // Set timeout to try again.
              setTimeout(setScroll, 30);
            }
          };
          setScroll();
        };
      })(this)).bind('mouseleave', (function(playlist) {
        return function(event) {
          event.preventDefault();
          playlist.scrolling = false;
        };
      })(this));
    }

    this.scroll.refresh();
    this.scroll.scrollTo(0, 0, 200);
  }
};

/**
 * Adds a new node to the playlist.
 *
 * @param {object} node The node that you would like to add to the playlist.
 */
osmplayer.playlist.prototype.addNode = function(node) {

  // Get the current index for this node.
  var index = this.nodes.length;

  // Create the teaser object.
  var teaser = this.create('teaser', 'osmplayer', this.elements.list);

  // Set the node for this teaser.
  teaser.setNode(node);

  // Bind to when it loads.
  teaser.ubind(this.uuid + ':nodeLoad', (function(playlist) {
    return function(event, data) {
      playlist.loadItem(index, true);
    };
  })(this));

  // Add this to our nodes array.
  this.nodes.push(teaser);
};

/**
 * Sets the playlist.
 *
 * @param {object} playlist The playlist object.
 * @param {integer} loadIndex The index of the item to load.
 */
osmplayer.playlist.prototype.set = function(playlist, loadIndex) {

  // Check to make sure the playlist is an object.
  if (typeof playlist !== 'object') {
    this.trigger('error', 'Playlist must be an object to set');
    return;
  }

  // Check to make sure the playlist has correct format.
  if (!playlist.hasOwnProperty('total_rows')) {
    this.trigger('error', 'Unknown playlist format.');
    return;
  }

  // Make sure the playlist has some rows.
  if (playlist.total_rows && playlist.nodes.length) {

    // Set the total rows.
    this.totalItems = playlist.total_rows;
    this.currentItem = 0;

    // Show or hide the next page if there is or is not a next page.
    if ((((this.page + 1) * this.options.pageLimit) >= this.totalItems) ||
        (this.totalItems == playlist.nodes.length)) {
      this.pager.nextPage.hide();
    }
    else {
      this.pager.nextPage.show();
    }

    var teaser = null;
    var numNodes = playlist.nodes.length;
    this.elements.list.empty();
    this.nodes = [];

    // Iterate through all the nodes.
    for (var index = 0; index < numNodes; index++) {

      // Add this node to the playlist.
      this.addNode(playlist.nodes[index]);

      // If the index is equal to the loadIndex.
      if (loadIndex === index) {
        this.loadItem(index);
      }
    }

    // Refresh the sizes.
    this.refreshScroll();

    // Trigger that the playlist has loaded.
    this.trigger('playlistLoad', playlist);
  }

  // Show that we are no longer busy.
  if (this.elements.playlist_busy) {
    this.elements.playlist_busy.hide();
  }
};

/**
 * Stores the current playlist state in the playqueue.
 */
osmplayer.playlist.prototype.setQueue = function() {

  // Add this item to the playqueue.
  this.playqueue.push({
    page: this.page,
    item: this.currentItem
  });

  // Store the current playqueue position.
  this.playqueuepos = this.playqueue.length;
};

/**
 * Loads the next item.
 *
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.next = function() {
  var item = 0, page = this.page;

  // See if we are at the front of the playqueue.
  if (this.playqueuepos >= this.playqueue.length) {

    // If this is shuffle, then load a random item.
    if (this.options.shuffle) {
      item = Math.floor(Math.random() * this.totalItems);
      page = Math.floor(item / this.options.pageLimit);
      item = item % this.options.pageLimit;
      return this.load(page, item);
    }
    else {

      // Otherwise, increment the current item by one.
      item = (this.currentItem + 1);
      if (item >= this.nodes.length) {
        return this.load(page + 1, 0);
      }
      else {
        return this.loadItem(item);
      }
    }
  }
  else {

    // Load the next item in the playqueue.
    this.playqueuepos = this.playqueuepos + 1;
    var currentQueue = this.playqueue[this.playqueuepos];
    return this.load(currentQueue.page, currentQueue.item);
  }
};

/**
 * Loads the previous item.
 *
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.prev = function() {

  // Move back into the playqueue.
  this.playqueuepos = this.playqueuepos - 1;
  this.playqueuepos = (this.playqueuepos < 0) ? 0 : this.playqueuepos;
  var currentQueue = this.playqueue[this.playqueuepos];
  if (currentQueue) {
    return this.load(currentQueue.page, currentQueue.item);
  }
  return false;
};

/**
 * Loads a playlist node.
 *
 * @param {number} index The index of the item you would like to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.loadItem = function(index, autoplay) {
  if (index < this.nodes.length) {
    this.setQueue();

    // Get the teaser at the current index and deselect it.
    var teaser = this.nodes[this.currentItem];
    teaser.select(false);
    this.currentItem = index;

    // Get the new teaser and select it.
    teaser = this.nodes[index];
    teaser.select(true);
    teaser.node.autoplay = !!autoplay;
    this.trigger('nodeLoad', teaser.node);
    return true;
  }

  return false;
};

/**
 * Loads the next page.
 *
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.nextPage = function(loadIndex) {
  return this.load(this.page + 1, loadIndex);
};

/**
 * Loads the previous page.
 *
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.prevPage = function(loadIndex) {
  return this.load(this.page - 1, loadIndex);
};

/**
 * Loads a playlist.
 *
 * @param {integer} page The page to load.
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.load = function(page, loadIndex) {

  // If the playlist and pages are the same, then no need to load.
  if ((this.playlist == this.options.playlist) && (page == this.page)) {
    return this.loadItem(loadIndex);
  }

  // Set the new playlist.
  this.playlist = this.options.playlist;

  // Return if there aren't any playlists to play.
  if (!this.playlist) {
    return false;
  }

  // Determine if we need to loop.
  var maxPages = Math.floor(this.totalItems / this.options.pageLimit);
  if (page > maxPages) {
    if (this.options.loop) {
      page = 0;
      loadIndex = 0;
    }
    else {
      return false;
    }
  }

  // Say that we are busy.
  if (this.elements.playlist_busy) {
    this.elements.playlist_busy.show();
  }

  // Normalize the page.
  page = page || 0;
  page = (page < 0) ? 0 : page;

  // Set the queue.
  this.setQueue();

  // Set the new page.
  this.page = page;

  // Hide or show the page based on if we are on the first page.
  if (this.page === 0) {
    this.pager.prevPage.hide();
  }
  else {
    this.pager.prevPage.show();
  }

  // If the playlist is an object, then go ahead and set it.
  if (typeof this.playlist == 'object') {
    this.set(this.playlist, loadIndex);
    if (this.playlist.endpoint) {
      this.playlist = this.options.playlist = this.playlist.endpoint;
    }
    return true;
  }

  // Get the highest priority parser.
  var parser = osmplayer.parser['default'];
  for (var name in osmplayer.parser) {
    if (osmplayer.parser.hasOwnProperty(name)) {
      if (osmplayer.parser[name].valid(this.playlist)) {
        if (osmplayer.parser[name].priority > parser.priority) {
          parser = osmplayer.parser[name];
        }
      }
    }
  }

  // The start index.
  var start = this.page * this.options.pageLimit;

  // Get the feed from the parser.
  var feed = parser.getFeed(
    this.playlist,
    start,
    this.options.pageLimit
  );

  // Build our request.
  var request = {
    type: 'GET',
    url: feed,
    success: (function(playlist) {
      return function(data) {
        playlist.set(parser.parse(data), loadIndex);
      };
    })(this),
    error: (function(playlist) {
      return function(XMLHttpRequest, textStatus, errorThrown) {
        if (playlist.elements.playlist_busy) {
          playlist.elements.playlist_busy.hide();
        }
        playlist.trigger('error', textStatus);
      };
    })(this)
  };

  // Set the data if applicable.
  var dataType = parser.getType();
  if (dataType) {
    request.dataType = dataType;
  }

  // Perform an ajax callback.
  jQuery.ajax(request);

  // Return that we did something.
  return true;
};
