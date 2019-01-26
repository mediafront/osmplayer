/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Define the scroll object.
osmplayer.scroll = osmplayer.scroll || {};

/**
 * Constructor for the minplayer.controller
 */
osmplayer.scroll['default'] = function(context, options) {

  // Derive from scroll
  osmplayer.scroll.call(this, context, options);
};


// Define the prototype for all controllers.
osmplayer.scroll['default'].prototype = new osmplayer.scroll();
osmplayer.scroll['default'].prototype.constructor = osmplayer.scroll['default'];

/**
 * Return the display for this plugin.
 */
osmplayer.scroll['default'].prototype.getDisplay = function() {

  // See if we need to build the scroll bar.
  if (this.options.build) {
    this.context.append('\
    <div class="osmplayer-default-playlist-scroll ui-widget-content">\
      <div class="osmplayer-default-playlist-scrollbar"></div>\
      <div class="minplayer-default-loader-wrapper">\
        <div class="minplayer-default-loader"></div>\
      </div>\
      <div class="osmplayer-default-playlist-list"></div>\
    </div>');
  }

  return jQuery(".osmplayer-default-playlist-scroll", this.context);
}

// Return the elements
osmplayer.scroll['default'].prototype.getElements = function() {
  var elements = osmplayer.scroll.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    playlist_busy:jQuery(".minplayer-default-loader-wrapper", this.display),
    list:jQuery(".osmplayer-default-playlist-list", this.display),
    scroll:jQuery(".osmplayer-default-playlist-scrollbar", this.display)
  });
};
