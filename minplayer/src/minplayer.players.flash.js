/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The Flash media player class to control the flash fallback.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.flash = function(context, options, queue) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.flash.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.flash.prototype.constructor = minplayer.players.flash;

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.flash
 */
minplayer.players.flash.prototype.construct = function() {

  // Call the players.base constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'flash';
};

/**
 * @see minplayer.players.base#getPriority
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.flash.getPriority = function(file) {
  return 0;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.flash.canPlay = function(file) {
  return false;
};

/**
 * API to return the Flash player code provided params.
 *
 * @param {object} params The params used to populate the Flash code.
 * @return {object} A Flash DOM element.
 */
minplayer.players.flash.prototype.getFlash = function(params) {
  // Get the protocol.
  var protocol = window.location.protocol;
  if (protocol.charAt(protocol.length - 1) == ':') {
    protocol = protocol.substring(0, protocol.length - 1);
  }

  // Insert the swfobject javascript.
  var tag = document.createElement('script');
  var src = protocol;
  src += '://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js';
  tag.src = src;
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Create the swfobject.
  setTimeout((function(player) {
    return function tryAgain() {
      if (typeof swfobject !== 'undefined') {
        swfobject.embedSWF(
          params.swf,
          params.id,
          params.width,
          params.height,
          '9.0.0',
          false,
          params.flashvars,
          {
            allowscriptaccess: 'always',
            allowfullscreen: 'true',
            wmode: params.wmode,
            quality: 'high'
          },
          {
            id: params.id,
            name: params.id,
            playerType: 'flash'
          },
          function(e) {
            player.player = e.ref;
          }
        );
      }
      else {

        // Try again after 200 ms.
        setTimeout(tryAgain, 200);
      }
    };
  })(this), 200);

  // Return the div tag...
  return '<div id="' + params.id + '"></div>';
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.flash.prototype.playerFound = function() {
  return (this.display.find('object[playerType="flash"]').length > 0);
};
