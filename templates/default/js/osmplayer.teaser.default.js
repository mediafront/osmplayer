(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // Define the teaser object.
  osmplayer.teaser = osmplayer.teaser || {};

  // constructor.
  osmplayer.teaser[template] = function(context, options) {

    // Derive from teaser
    osmplayer.teaser.call(this, context, options);
  };

  // Define the prototype for all controllers.
  osmplayer.teaser[template].prototype = new osmplayer.teaser();
  osmplayer.teaser[template].prototype.constructor = osmplayer.teaser[template];

  /**
   * @see minplayer.plugin#construct
   */
  osmplayer.teaser[template].prototype.construct = function() {

    minplayer.display.prototype.construct.call(this);

    // Add some hover events.
    this.display.bind('mouseenter', (function(info) {
      return function() {
        info.addClass('ui-state-hover');
      };
    })(this.elements.info)).bind('mouseleave', (function(info) {
      return function() {
        info.removeClass('ui-state-hover');
      };
    })(this.elements.info));
  };

  /**
   * Return the display for this plugin.
   */
  osmplayer.teaser[template].prototype.getDisplay = function() {

    // Append this to the list.
    this.context.append('\
    <div class="osmplayer-' + template + '-teaser ui-widget-content">\
      <div class="osmplayer-' + template + '-teaser-image"></div>\
      <div class="osmplayer-' + template + '-teaser-info ui-state-default">\
        <div class="osmplayer-' + template + '-teaser-title"></div>\
      </div>\
    </div>');

    var teasers = jQuery('.osmplayer-' + template + '-teaser', this.context);
    return teasers.eq(teasers.length - 1);
  }

  /**
   * Selects the teaser.
   */
  osmplayer.teaser[template].prototype.select = function(selected) {
    if (selected) {
      this.elements.info.addClass('ui-state-active');
    }
    else {
      this.elements.info.removeClass('ui-state-active');
    }
  }


  // Return the elements
  osmplayer.teaser[template].prototype.getElements = function() {
    var elements = osmplayer.teaser.prototype.getElements.call(this);
    return jQuery.extend(elements, {
      info: jQuery('.osmplayer-' + template + '-teaser-info', this.display),
      title:jQuery('.osmplayer-' + template + '-teaser-title', this.display),
      image:jQuery('.osmplayer-' + template + '-teaser-image', this.display)
    });
  };
})('default', osmplayer);

