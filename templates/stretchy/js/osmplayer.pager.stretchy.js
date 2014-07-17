(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // Define the busy object.
  osmplayer.pager = osmplayer.pager || {};

  // constructor.
  osmplayer.pager[template] = function(context, options) {

    // Derive from pager
    osmplayer.pager.call(this, context, options);
  };

  // Define the prototype for all controllers.
  osmplayer.pager[template].prototype = new osmplayer.pager();
  osmplayer.pager[template].prototype.constructor = osmplayer.pager[template];

  /**
   * Return the display for this plugin.
   */
  osmplayer.pager[template].prototype.getDisplay = function() {

    if (this.options.build) {

      // append the pager.
      this.context.append('\
      <div class="osmplayer-' + template + '-playlist-pager ui-widget-header">\
        <div class="osmplayer-' + template + '-playlist-pager-left">\
          <a href="#" class="osmplayer-' + template + '-playlist-pager-link osmplayer-' + template + '-playlist-pager-prevpage minplayer-' + template + '-button ui-state-default ui-corner-all">\
            <span class="ui-icon ui-icon-circle-triangle-w"></span>\
          </a>\
        </div>\
        <div class="osmplayer-' + template + '-playlist-pager-right">\
          <a href="#" class="osmplayer-' + template + '-playlist-pager-link osmplayer-' + template + '-playlist-pager-nextpage minplayer-' + template + '-button ui-state-default ui-corner-all">\
            <span class="ui-icon ui-icon-circle-triangle-e"></span>\
          </a>\
        </div>\
      </div>');
    }

    return jQuery('.osmplayer-' + template + '-playlist-pager', this.context);
  }

  // Return the elements
  osmplayer.pager[template].prototype.getElements = function() {
    var elements = osmplayer.pager.prototype.getElements.call(this);
    return jQuery.extend(elements, {
      prevPage:jQuery('.osmplayer-' + template + '-playlist-pager-prevpage', this.display),
      nextPage:jQuery('.osmplayer-' + template + '-playlist-pager-nextpage', this.display)
    });
  };
})('stretchy', osmplayer);

