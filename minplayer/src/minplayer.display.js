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
 * @return {object} The jQuery context for this display.
 */
minplayer.display.prototype.getDisplay = function() {
  return this.context;
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.display.prototype.construct = function() {

  // Set the display.
  this.display = this.getDisplay(this.context, this.options);

  // Call the plugin constructor.
  minplayer.plugin.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'display';

  // Get the display elements.
  this.elements = this.getElements();

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
};

/** Keep track of all the show hide elements. */
minplayer.showHideElements = [];

/**
 * Show all the show hide elements.
 */
minplayer.showAll = function() {
  var i = minplayer.showHideElements.length;
  var obj = null;
  while (i--) {
    obj = minplayer.showHideElements[i];
    minplayer.showThenHide(obj.element, obj.timeout, obj.callback);
  }
};

/**
 * Stops the whole show then hide from happening.
 *
 * @param {object} element The element you want the showThenHide to stop.
 */
minplayer.stopShowThenHide = function(element) {
  element = jQuery(element);
  if (element.showTimer) {
    clearTimeout(element.showTimer);
  }
  element.stopShowThenHide = true;
  element.shown = true;
  element.show();
};

/**
 * Called if you would like for your display item to show then hide.
 *
 * @param {object} element The element you would like to hide or show.
 * @param {number} timeout The timeout to hide and show.
 * @param {function} callback Called when something happens.
 */
minplayer.showThenHide = function(element, timeout, callback) {

  // If no element exists, then just return.
  if (!element) {
    return;
  }

  // Ensure we have a timeout.
  timeout = timeout || 5000;

  // If this has not yet been configured.
  if (!element.showTimer) {
    element.shown = true;
    element.stopShowThenHide = false;

    // Add this to our showHideElements.
    minplayer.showHideElements.push({
      element: element,
      timeout: timeout,
      callback: callback
    });

    // Bind to a click event.
    minplayer.click(document, function() {
      if (!element.stopShowThenHide) {
        minplayer.showThenHide(element, timeout, callback);
      }
    });

    // Bind to the mousemove event.
    jQuery(document).bind('mousemove', function() {
      if (!element.stopShowThenHide) {
        minplayer.showThenHide(element, timeout, callback);
      }
    });
  }

  // Clear the timeout, and then setup the show then hide functionality.
  clearTimeout(element.showTimer);

  // Show the display.
  if (!element.shown && !element.forceHide) {
    element.shown = true;
    element.show();
    if (callback) {
      callback(true);
    }
  }

  // Set a timer to hide it after the timeout.
  element.showTimer = setTimeout(function() {
    element.hide('slow', function() {
      element.shown = false;
      if (callback) {
        callback(false);
      }
    });
  }, timeout);
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
    return window.screenfull = false;
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
