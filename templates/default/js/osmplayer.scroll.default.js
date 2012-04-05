(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // Define the scroll object.
  osmplayer.scroll = osmplayer.scroll || {};

  /**
   * Constructor for the minplayer.controller
   */
  osmplayer.scroll[template] = function(context, options) {

    // Derive from scroll
    osmplayer.scroll.call(this, context, options);
  };


  // Define the prototype for all controllers.
  osmplayer.scroll[template].prototype = new osmplayer.scroll();
  osmplayer.scroll[template].prototype.constructor = osmplayer.scroll[template];

  /**
   * Return the display for this plugin.
   */
  osmplayer.scroll[template].prototype.getDisplay = function() {

    // See if we need to build the scroll bar.
    if (this.options.build) {
      this.context.append('\
      <div class="osmplayer-' + template + '-playlist-scroll ui-widget-content">\
        <div class="osmplayer-' + template + '-playlist-scrollbar"></div>\
        <div class="minplayer-' + template + '-loader-wrapper">\
          <div class="minplayer-' + template + '-loader"></div>\
        </div>\
        <div class="osmplayer-' + template + '-playlist-list"></div>\
      </div>');
    }

    return jQuery('.osmplayer-' + template + '-playlist-scroll', this.context);
  }

  // Return the elements
  osmplayer.scroll[template].prototype.getElements = function() {
    var elements = osmplayer.scroll.prototype.getElements.call(this);
    return jQuery.extend(elements, {
      playlist_busy:jQuery('.minplayer-' + template + '-loader-wrapper', this.display),
      list:jQuery('.osmplayer-' + template + '-playlist-list', this.display),
      scroll:jQuery('.osmplayer-' + template + '-playlist-scrollbar', this.display)
    });
  };
})('default', osmplayer);

