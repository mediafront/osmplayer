/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides the scroll functionality for the playlists.
 *
 * We can calculate how the scrollbar controls the playlist using the
 * following diagram / equations.
 *  ___ ____________
 *  |  |            |\
 *  |  |    list    | \
 *  |  |            |y \
 *  |  |            |   \
 *  |  |____________|    \ _ _____
 *  |  |            |\    | |    |
 *  |  |            | \   | |    |
 *  |  |            |  \  | |x   |
 *  |  |            |   \ | |    |
 *  |  |            |    \|_|_   |
 *  |  |            |     | | |  |
 *  l  |   window   |     | | h  w
 *  |  |            |     |_|_|  |
 *  |  |            |    /| |    |
 *  |  |            |   / | |    |
 *  |  |            |  / v| |    |
 *  |  |            | /   | |    |
 *  |  |____________|/    |_|____|
 *  |  |            |    /
 *  |  |            |   /
 *  |  |            |  /
 *  |  |            | /
 *  |__|____________|/
 *
 *  l - The list height.
 *  h - Handle Bar height.
 *  w - Window height.
 *  x - The distance from top of window to the top of the handle.
 *  y - The disatnce from the top of the list to the top of the window.
 *  v - The distance from bottom of window to the bottom of the handle.
 *
 *  jQuery UI provides "v".  We already know "l", "h", "w".  We can then
 *  calculate the relationship between the scroll bar handle position to the
 *  list position using the following equations.
 *
 *  x = (w - (v + h))
 *  y = ((l - w)/(w - h)) * x
 *
 *   -- or --
 *
 *  y = ((l - w)/(w - h)) * (w - (v + h))
 *
 *  We can statically calculate the ((l - w)/(w - h)) as a ratio and use
 *  that to speed up calculations as follows.
 *
 *  ratio = ((l - w)/(w - h));
 *
 *  So, our translation equations are as follows...
 *
 *    y = ratio * (w - (v + h))
 *    v = w - (h + (y / ratio))
 *
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.scroll = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'scroll', context, options);
};

/** Derive from minplayer.display. */
osmplayer.scroll.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.scroll.prototype.constructor = osmplayer.scroll;

/**
 * @see minplayer.plugin#construct
 */
osmplayer.scroll.prototype.construct = function() {

  // Make sure we provide default options...
  this.options = jQuery.extend({
    vertical: true,
    hysteresis: 40,
    scrollSpeed: 20,
    scrollMode: 'auto'
  }, this.options);

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Make this component orientation agnostic.
  this.pos = this.options.vertical ? 'pageY' : 'pageX';
  this.offset = this.options.vertical ? 'top' : 'left';
  this.margin = this.options.vertical ? 'marginTop' : 'marginLeft';
  this.size = this.options.vertical ? 'height' : 'width';
  this.outer = this.options.vertical ? 'outerHeight' : 'outerWidth';

  this.getMousePos = function(event) {
    return (event[this.pos] - this.display.offset()[this.offset]);
  };
  this.getPos = function(handlePos) {
    if (this.options.vertical) {
      return this.ratio * (this.scrollSize - (handlePos + this.handleSize));
    }
    else {
      return this.ratio * handlePos;
    }
  };
  this.getHandlePos = function(pos) {
    if (this.options.vertical) {
      return this.scrollSize - (this.handleSize + (pos / this.ratio));
    }
    else {
      return (pos / this.ratio);
    }
  };

  // If they have a scroll bar.
  if (this.elements.scroll) {

    // Get the values of our variables.
    var scroll = this.elements.scroll;
    this.handleSize = 0;
    this.scrollTop = 0;
    this.mousePos = 0;

    // Refresh the scroll.
    this.refresh();

    // Create the scroll bar slider control.
    this.scroll = scroll.slider({
      orientation: this.options.vertical ? 'vertical' : 'horizontal',
      max: this.scrollSize,
      create: (function(scroll, vertical) {
        return function(event, ui) {
          var handle = jQuery('.ui-slider-handle', event.target);
          scroll.handleSize = handle[scroll.outer]();
          scroll.scrollTop = (scroll.scrollSize - scroll.handleSize);
          var initValue = vertical ? scroll.scrollTop : 0;
          jQuery(this).slider('option', 'value', initValue);
        };
      })(this, this.options.vertical),
      slide: (function(scroll, vertical) {
        return function(event, ui) {
          // Get the new position.
          var pos = scroll.getPos(ui.value);

          // Ensure it doesn't go over the limits.
          if (vertical && (pos < 0)) {
            scroll.scroll.slider('option', 'value', scroll.scrollTop);
            return false;
          }
          else if (!vertical && (ui.value > scroll.scrollTop)) {
            scroll.scroll.slider('option', 'value', scroll.scrollTop);
            return false;
          }

          // Set our list position.
          scroll.elements.list.css(scroll.margin, -pos + 'px');
          return true;
        };
      })(this, this.options.vertical)
    });

    // If they wish to have auto scroll mode.
    if (this.options.scrollMode == 'auto') {

      // Bind to the mouse events.
      this.elements.list.bind('mousemove', (function(scroll) {

        // Return our event function.
        return function(event) {
          event.preventDefault();
          scroll.mousePos = event[scroll.pos];
          scroll.mousePos -= scroll.display.offset()[scroll.offset];
        };

      })(this)).bind('mouseenter', (function(scroll) {

        // Return our event function.
        return function(event) {
          event.preventDefault();
          scroll.scrolling = true;
          setTimeout(function setScroll() {
            if (scroll.scrolling) {

              // Get the delta.
              var delta = scroll.mousePos - scroll.scrollMid;

              // Determine if we are within our hysteresis.
              if (Math.abs(delta) > scroll.options.hysteresis) {

                // Get the hysteresis and delta.
                var hyst = scroll.options.hysteresis;
                hyst *= (delta > 0) ? -1 : 0;
                delta = (scroll.options.scrollSpeed * (delta + hyst));
                delta /= scroll.scrollMid;

                // Get the scroll position.
                var pos = scroll.elements.list.css(scroll.margin);
                pos = parseFloat(pos) - delta;
                pos = (pos > 0) ? 0 : pos;

                // Get the maximum top position.
                var top = -scroll.listSize + scroll.scrollSize;
                pos = (pos < top) ? top : pos;

                // Set the new scroll position.
                scroll.elements.list.css(scroll.margin, pos + 'px');

                // Set the scroll position.
                pos = scroll.getHandlePos(-pos);
                scroll.scroll.slider('option', 'value', pos);
              }

              // Set timeout to try again.
              setTimeout(setScroll, 20);
            }
          }, 20);
        };

      })(this)).bind('mouseleave', (function(scroll) {

        // Return our event function.
        return function(event) {
          event.preventDefault();
          scroll.scrolling = false;
        };

      })(this));
    }
  }
};

/**
 * Refreshes the scroll list.
 */
osmplayer.scroll.prototype.refresh = function() {

  // The list size.
  if (this.options.vertical) {
    this.listSize = this.elements.list.height();
  }
  else {
    this.listSize = 0;
    jQuery.each(this.elements.list.children(), (function(scroll) {
      return function() {
        scroll.listSize += jQuery(this)[scroll.outer]();
      };
    })(this));

    // Set the list size.
    this.elements.list[this.size](this.listSize);
  }

  // Refresh the list.
  this.onResize();

  // Set the scroll position.
  if (this.scroll) {
    this.elements.list.css(this.margin, '0px');
    this.scroll.slider('option', 'value', this.getHandlePos(0));
  }
};

/**
 * Refresh all the variables that may change.
 */
osmplayer.scroll.prototype.onResize = function() {
  this.scrollSize = this.elements.scroll[this.size]();
  this.scrollMid = this.scrollSize / 2;
  this.scrollTop = (this.scrollSize - this.handleSize);
  this.ratio = (this.listSize - this.scrollSize);
  this.ratio /= (this.scrollSize - this.handleSize);
  if (this.scroll) {
    this.scroll.slider('option', 'max', this.scrollSize);
  }
};
