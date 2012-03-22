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
    <div class="osmplayer-playlist-pager ui-state-default">\
      <div class="osmplayer-playlist-pager-left">\
        <a href="#" class="osmplayer-playlist-pager-link osmplayer-playlist-pager-prevpage">&nbsp;</a>\
      </div>\
      <div class="osmplayer-playlist-pager-right">\
        <a href="#" class="osmplayer-playlist-pager-link osmplayer-playlist-pager-nextpage">&nbsp;</a>\
      </div>\
    </div>');
  }

  return jQuery('.osmplayer-playlist-pager', this.context);
}

// Return the elements
osmplayer.pager['default'].prototype.getElements = function() {
  var elements = osmplayer.pager.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    prevPage:jQuery(".osmplayer-playlist-pager-prevpage", this.display),
    nextPage:jQuery(".osmplayer-playlist-pager-nextpage", this.display)
  });
};
