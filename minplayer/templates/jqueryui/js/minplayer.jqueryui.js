/** The minplayer namespace. */
var minplayer = minplayer || {};

// Default player.
minplayer["jqueryui"] = function(context, options) {

  // Derive from minplayer.
  minplayer.call(this, context, options);
};

/**
 * Define this template prototype.
 */
minplayer["jqueryui"].prototype = new minplayer();
minplayer["jqueryui"].prototype.constructor = minplayer["jqueryui"];

/**
 * Return the display for this plugin.
 */
minplayer["jqueryui"].prototype.getDisplay = function() {

  // If this is the bottom element, then build the player.
  if (this.context.children().length == 0) {

    // Build out the player provided the base tag.
    this.context = this.context.attr({
      'id': this.options.id + '-player',
      'class': 'minplayer-jqueryui-media'
    })
    .wrap(jQuery(document.createElement('div')).attr({
      'class': 'minplayer-jqueryui-display ui-widget-content'
    })).parent('.minplayer-jqueryui-display')
    .wrap(jQuery(document.createElement('div')).attr({
      'id': this.options.id,
      'class': 'minplayer-jqueryui player-ui'
    })).parent('.minplayer-jqueryui')
    .append('\
      <div class="minplayer-jqueryui-logo"></div>\
      <div class="minplayer-jqueryui-error"></div>'
    );

    // Mark a flag that says this display needs to be built.
    this.options.build = true;
  }

  // Return the display.
  return this.context;
}

// Get the elements for this player.
minplayer["jqueryui"].prototype.getElements = function() {
  var elements = minplayer.prototype.getElements.call(this);

  // Set the width and height of this element.
  this.display.width(this.options.width);
  this.display.height(this.options.height);

  // Return the jQuery elements.
  return jQuery.extend(elements, {
    player:this.display,
    display:jQuery(".minplayer-jqueryui-display", this.display),
    media:jQuery(".minplayer-jqueryui-media", this.display),
    error:jQuery('.minplayer-jqueryui-error', this.display),
    logo:jQuery('.minplayer-jqueryui-logo', this.display)
  });
};
