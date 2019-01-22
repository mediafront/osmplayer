/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Default player.
osmplayer['default'] = function(context, options) {

  // Derive from osmplayer.
  osmplayer.call(this, context, options);
};

/**
 * Define this template prototype.
 */
osmplayer['default'].prototype = new osmplayer();
osmplayer['default'].prototype.constructor = osmplayer['default'];

/**
 * Return the display for this plugin.
 */
osmplayer['default'].prototype.getDisplay = function() {

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
      'class': 'media-player'
    })).parent('.media-player')
    .wrap(jQuery(document.createElement('div')).attr({
      'id': this.options.id,
      'class': 'osmplayer'
    })).parent('.osmplayer');

    // Mark a flag that says this display needs to be built.
    this.options.build = true;
  }

  return this.context;
}

// Get the elements for this player.
osmplayer['default'].prototype.getElements = function() {
  var elements = osmplayer.prototype.getElements.call(this);

  // Return the jQuery elements.
  return jQuery.extend(elements, {
    player:this.display,
    minplayer:jQuery(".media-player", this.display),
    display:jQuery(".media-player-display", this.display),
    media:jQuery("#" + this.options.id + "-player", this.display),
    error:jQuery('.media-player-error', this.display),
    playlist:jQuery('.osmplayer-playlist', this.display)
  });
};
