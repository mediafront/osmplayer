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

  // If the tag is video or audio, then build out the player.
  var tag = this.context.get(0).tagName.toLowerCase();
  if (tag == 'video' || tag == 'audio') {

    // Build out the player provided the base tag.
    this.context = this.context.attr({
      'id': this.options.id + '-player',
      'class': 'media-player-media'
    })
    .wrap(jQuery(document.createElement('div')).attr({
      'class': 'media-player-display'
    })).parent('.media-player-display')
    .wrap(jQuery(document.createElement('div')).attr({
      'id': this.options.id,
      'class': 'media-player'
    })).parent('.media-player');

    // Mark a flag that says this display needs to be built.
    this.options.build = true;
  }

  // Return the display.
  return this.context;
}

// Get the elements for this player.
minplayer["default"].prototype.getElements = function() {
  var elements = minplayer.prototype.getElements.call(this);

  // Return the jQuery elements.
  return jQuery.extend(elements, {
    player:this.display,
    display:jQuery(".media-player-display", this.display),
    media:jQuery("#" + this.options.id + "-player", this.display),
    error:jQuery('.media-player-error', this.display)
  });
};
