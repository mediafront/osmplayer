/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Define the teaser object.
osmplayer.teaser = osmplayer.teaser || {};

// constructor.
osmplayer.teaser['default'] = function(context, options) {

  // Derive from teaser
  osmplayer.teaser.call(this, context, options);
};

// Define the prototype for all controllers.
osmplayer.teaser['default'].prototype = new osmplayer.teaser();
osmplayer.teaser['default'].prototype.constructor = osmplayer.teaser['default'];

/**
 * @see minplayer.plugin#construct
 */
osmplayer.teaser['default'].prototype.construct = function() {

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
osmplayer.teaser['default'].prototype.getDisplay = function(context, options) {

  // Append this to the list.
  context.append('\
  <div class="osmplayer-teaser ui-widget-content">\
    <div class="osmplayer-teaser-image"></div>\
    <div class="osmplayer-teaser-info ui-state-default">\
      <div class="osmplayer-teaser-title">Sample Title</div>\
    </div>\
  </div>');

  var teasers = jQuery('.osmplayer-teaser', context);
  return teasers.eq(teasers.length - 1);
}

/**
 * Selects the teaser.
 */
osmplayer.teaser['default'].prototype.select = function(selected) {
  if (selected) {
    this.elements.info.addClass('ui-state-active');
  }
  else {
    this.elements.info.removeClass('ui-state-active');
  }
}


// Return the elements
osmplayer.teaser['default'].prototype.getElements = function() {
  var elements = osmplayer.teaser.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    info: jQuery(".osmplayer-teaser-info", this.display),
    title:jQuery(".osmplayer-teaser-title", this.display),
    image:jQuery(".osmplayer-teaser-image", this.display)
  });
};
