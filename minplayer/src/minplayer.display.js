/** The minplayer namespace. */
minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.plugin
 * @class Base class used to provide the display and options for any component
 * deriving from this class.  Components who derive are expected to provide
 * the elements that they define by implementing the getElements method.
 *
 * @param {string} name The name of this plugin.
 * @param {object} context The jQuery context this component resides.
 * @param {object} options The options for this component.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.display = function(name, context, options, queue) {

  // Derive from plugin
  minplayer.plugin.call(this, name, context, options, queue);
};

/** Derive from minplayer.plugin. */
minplayer.display.prototype = new minplayer.plugin();

/** Reset the constructor. */
minplayer.display.prototype.constructor = minplayer.display;

/**
 * Returns the display for this component.
 *
 * @param {object} context The context which this display is within.
 * @param {object} options The options to get the display.
 *
 * @return {object} The jQuery context for this display.
 */
minplayer.display.prototype.getDisplay = function(context, options) {

  // Return the context.
  return context;
};

/**
 * @see minplayer.plugin.initialize
 */
minplayer.display.prototype.initialize = function() {

  // Only set the display if it hasn't already been set.
  if (!this.display) {

    // Set the display.
    this.display = this.getDisplay(this.context, this.options);
  }

  // Only continue loading this plugin if there is a display.
  if (this.display) {

    // Set the plugin name within the options.
    this.options.pluginName = 'display';

    // Get the display elements.
    this.elements = this.getElements();

    // Call the plugin initialize method.
    minplayer.plugin.prototype.initialize.call(this);
  }
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.display.prototype.construct = function() {

  // Call the plugin constructor.
  minplayer.plugin.prototype.construct.call(this);

  // Set if this display is in autohide.
  this.autoHide = false;

  // Only do this if they allow resize for this display.
  if (this.onResize) {

    // Set the resize timeout and this pointer.
    var resizeTimeout = 0;

    // Add a handler to trigger a resize event.
    jQuery(window).resize((function(display) {
      return function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          display.onResize();
        }, 200);
      };
    })(this));
  }
};

/**
 * Called when the window resizes.
 */
minplayer.display.prototype.onResize = false;

/**
 * Wrapper around hide that will always not show.
 *
 * @param {object} element The element you wish to hide.
 */
minplayer.display.prototype.hide = function(element) {
  element = element || this.display;
  if (element) {
    element.forceHide = true;
    element.unbind().hide();
  }
};

/**
 * Gets the full screen element.
 *
 * @return {object} The display to be used for full screen support.
 */
minplayer.display.prototype.fullScreenElement = function() {
  return this.display;
};

/**
 * Fix for the click function in jQuery to be cross platform.
 *
 * @param {object} element The element that will be clicked.
 * @param {function} fn Called when the element is clicked.
 * @return {object} The element that is to be clicked.
 */
minplayer.click = function(element, fn) {
  var flag = false;
  element = jQuery(element);
  element.bind('touchstart click', function(event) {
    if (!flag) {
      flag = true;
      setTimeout(function() {
        flag = false;
      }, 100);
      fn.call(this, event);
    }
  });
  return element;
};

/**
 * Determines if the player is in focus or not.
 *
 * @param {boolean} focus If the player is in focus.
 */
minplayer.display.prototype.onFocus = function(focus) {
  this.hasFocus = this.focus = focus;

  // If they have autoHide enabled, then show then hide this element.
  if (this.autoHide) {
    this.showThenHide(
      this.autoHide.element,
      this.autoHide.timeout,
      this.autoHide.cb
    );
  }
};

/**
 * Called if you would like for your plugin to show then hide.
 *
 * @param {object} element The element you would like to hide or show.
 * @param {number} timeout The timeout to hide and show.
 * @param {function} cb Called when something happens.
 */
minplayer.display.prototype.showThenHide = function(element, timeout, cb) {

  // Get the element type.
  var elementType = (typeof element);

  // Set some interface defaults.
  if (elementType === 'undefined') {
    cb = null;
    element = this.display;
  }
  else if (elementType === 'number') {
    cb = timeout;
    timeout = element;
    element = this.display;
  }
  else if (elementType === 'function') {
    cb = element;
    element = this.display;
  }

  if (!element) {
    return;
  }

  // Make sure we have a timeout.
  timeout = timeout || 5000;

  // Set the autohide variable.
  this.autoHide = {
    element: element,
    timeout: timeout,
    cb: cb
  };

  // Show the element.
  if (!element.forceHide) {
    if (typeof element.showMe !== 'undefined') {
      if (element.showMe) {
        element.showMe(cb);
      }
    }
    else {
      element.show();
      if (cb) {
        cb(true);
      }
    }
  }

  // Define the hover state for this element.
  if (!element.hoverState) {
    jQuery(element).bind('mouseenter', function() {
      element.hoverState = true;
    });
    jQuery(element).bind('mouseleave', function() {
      element.hoverState = false;
    });
  }

  // Clear the timeout and start it over again.
  clearTimeout(this.showTimer);
  this.showTimer = setTimeout((function(self) {
    return function tryAgain() {

      // Check the hover state.
      if (!element.hoverState) {
        if (typeof element.hideMe !== 'undefined') {
          if (element.hideMe) {
            element.hideMe(cb);
          }
        }
        else {
          // Hide the element.
          element.hide('slow', function() {
            if (cb) {
              cb(false);
            }
          });
        }
      }
      else {

        // Try again in the timeout time.
        self.showTimer = setTimeout(tryAgain, timeout);
      }
    };
  })(this), timeout);
};

/**
 * Make this display element go fullscreen.
 *
 * @param {boolean} full Tell the player to go into fullscreen or not.
 */
minplayer.display.prototype.fullscreen = function(full) {
  var isFull = this.isFullScreen();
  var element = this.fullScreenElement();
  if (isFull && !full) {
    element.removeClass('fullscreen');
    if (screenfull) {
      screenfull.exit();
    }
    this.trigger('fullscreen', false);
  }
  else if (!isFull && full) {
    element.addClass('fullscreen');
    if (screenfull) {
      screenfull.request(element[0]);
      screenfull.onchange = (function(display) {
        return function(e) {
          if (!screenfull.isFullscreen) {
            display.fullscreen(false);
          }
        };
      })(this);
    }
    this.trigger('fullscreen', true);
  }
};

/**
 * Toggle fullscreen.
 */
minplayer.display.prototype.toggleFullScreen = function() {
  this.fullscreen(!this.isFullScreen());
};

/**
 * Checks to see if we are in fullscreen mode.
 *
 * @return {boolean} TRUE - fullscreen, FALSE - otherwise.
 */
minplayer.display.prototype.isFullScreen = function() {
  return this.fullScreenElement().hasClass('fullscreen');
};

/**
 * Returns a scaled rectangle provided a ratio and the container rect.
 *
 * @param {number} ratio The width/height ratio of what is being scaled.
 * @param {object} rect The bounding rectangle for scaling.
 * @return {object} The Rectangle object of the scaled rectangle.
 */
minplayer.display.prototype.getScaledRect = function(ratio, rect) {
  var scaledRect = {};
  scaledRect.x = rect.x ? rect.x : 0;
  scaledRect.y = rect.y ? rect.y : 0;
  scaledRect.width = rect.width ? rect.width : 0;
  scaledRect.height = rect.height ? rect.height : 0;
  if (ratio) {
    if ((rect.width / rect.height) > ratio) {
      scaledRect.height = rect.height;
      scaledRect.width = Math.floor(rect.height * ratio);
    }
    else {
      scaledRect.height = Math.floor(rect.width / ratio);
      scaledRect.width = rect.width;
    }
    scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
    scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
  }
  return scaledRect;
};

/**
 * Returns all the jQuery elements that this component uses.
 *
 * @return {object} An object which defines all the jQuery elements that
 * this component uses.
 */
minplayer.display.prototype.getElements = function() {
  return {};
};

/**
 * From https://github.com/sindresorhus/screenfull.js
 */
/*global Element:true*/
(function(window, document) {
  'use strict';
  var methods = (function() {
    var methodMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenchange',
        'fullscreen',
        'fullscreenElement'
      ],
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitIsFullScreen',
        'webkitCurrentFullScreenElement'
      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozfullscreenchange',
        'mozFullScreen',
        'mozFullScreenElement'
      ]
    ];
    for (var i = 0, l = methodMap.length; i < l; i++) {
      if (methodMap.hasOwnProperty(i)) {
        var val = methodMap[i];
        if (val[1] in document) {
          return val;
        }
      }
    }
  })();

  if (!methods) {
    window.screenfull = false;
    return window.screenfull;
  }

  var keyboardAllowed = 'ALLOW_KEYBOARD_INPUT' in Element;

  var screenfull = {
    init: function() {
      document.addEventListener(methods[2], function(e) {
        screenfull.isFullscreen = document[methods[3]];
        screenfull.element = document[methods[4]];
        screenfull.onchange(e);
      });
      return this;
    },
    isFullscreen: document[methods[3]],
    element: document[methods[4]],
    request: function(elem) {
      elem = elem || document.documentElement;
      elem[methods[0]](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      // Work around Safari 5.1 bug: reports support for keyboard in fullscreen
      // even though it doesn't.
      if (!document.isFullscreen) {
        elem[methods[0]]();
      }
    },
    exit: function() {
      document[methods[1]]();
    },
    toggle: function(elem) {
      if (this.isFullscreen) {
        this.exit();
      } else {
        this.request(elem);
      }
    },
    onchange: function() {}
  };

  window.screenfull = screenfull.init();
})(window, document);
