/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Define the busy object.
osmplayer.pager = osmplayer.pager || {};

// constructor.
osmplayer.pager['default'] = function(context, options) {

  // Derive from pager
  osmplayer.pager.call(this, context, options);
};

// Define the prototype for all controllers.
osmplayer.pager['default'].prototype = new osmplayer.pager();
osmplayer.pager['default'].prototype.constructor = osmplayer.pager['default'];

/**
 * Return the display for this plugin.
 */
osmplayer.pager['default'].prototype.getDisplay = function() {

  if (this.options.build) {

    // append the pager.
    this.context.append('\
    <div class="osmplayer-default-playlist-pager ui-widget-header">\
      <div class="osmplayer-default-playlist-pager-left">\
        <a href="#" class="osmplayer-default-playlist-pager-link osmplayer-default-playlist-pager-prevpage minplayer-default-button ui-state-default ui-corner-all">\
          <span class="ui-icon ui-icon-circle-triangle-w"></span>\
        </a>\
      </div>\
      <div class="osmplayer-default-playlist-pager-right">\
        <a href="#" class="osmplayer-default-playlist-pager-link osmplayer-default-playlist-pager-nextpage minplayer-default-button ui-state-default ui-corner-all">\
          <span class="ui-icon ui-icon-circle-triangle-e"></span>\
        </a>\
      </div>\
    </div>');
  }

  return jQuery('.osmplayer-default-playlist-pager', this.context);
}

// Return the elements
osmplayer.pager['default'].prototype.getElements = function() {
  var elements = osmplayer.pager.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    prevPage:jQuery(".osmplayer-default-playlist-pager-prevpage", this.display),
    nextPage:jQuery(".osmplayer-default-playlist-pager-nextpage", this.display)
  });
};
