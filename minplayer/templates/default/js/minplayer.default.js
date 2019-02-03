/** The minplayer namespace. */
var minplayer = minplayer || {};

// Default player.
minplayer["default"] = function(context, options) {

  // Derive from minplayer.
  minplayer.call(this, context, options);
};

/**
 * Define this template prototype.
 */
minplayer["default"].prototype = new minplayer();
minplayer["default"].prototype.constructor = minplayer["default"];

/**
 * Return the display for this plugin.
 */
minplayer["default"].prototype.getDisplay = function() {

  // If this is the bottom element, then build the player.
  if (this.context.children().length == 0) {

    // Build out the player provided the base tag.
    this.context = this.context.attr({
      'id': this.options.id + '-player',
      'class': 'minplayer-default-media'
    })
    .wrap(jQuery(document.createElement('div')).attr({
      'class': 'minplayer-default-display ui-widget-content'
    })).parent('.minplayer-default-display')
    .wrap(jQuery(document.createElement('div')).attr({
      'id': this.options.id,
      'class': 'minplayer-default player-ui'
    })).parent('.minplayer-default')
    .append('\
      <div class="minplayer-default-logo"></div>\
      <div class="minplayer-default-error"></div>'
    );

    // Mark a flag that says this display needs to be built.
    this.options.build = true;
  }

  // Return the display.
  return this.context;
}

// Get the elements for this player.
minplayer["default"].prototype.getElements = function() {
  var elements = minplayer.prototype.getElements.call(this);

  // Set the width and height of this element.
  this.display.width(this.options.width);
  this.display.height(this.options.height);

  // Return the jQuery elements.
  return jQuery.extend(elements, {
    player:this.display,
    display:jQuery(".minplayer-default-display", this.display),
    media:jQuery(".minplayer-default-media", this.display),
    error:jQuery('.minplayer-default-error', this.display),
    logo:jQuery('.minplayer-default-logo', this.display)
  });
};
