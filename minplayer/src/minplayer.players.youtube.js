/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The YouTube media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.youtube = function(context, options, queue) {

  /** The quality of the YouTube stream. */
  this.quality = 'default';

  // Derive from players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.youtube.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.youtube.prototype.constructor = minplayer.players.youtube;

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.youtube
 */
minplayer.players.youtube.prototype.construct = function() {

  // Call the players.flash constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'youtube';
};

/**
 * @see minplayer.players.base#getPriority
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.youtube.getPriority = function(file) {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.youtube.canPlay = function(file) {

  // Check for the mimetype for youtube.
  if (file.mimetype === 'video/youtube') {
    return true;
  }

  // If the path is a YouTube path, then return true.
  return (file.path.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.youtube.getMediaId = function(file) {
  var reg = /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_\-]+)/i;
  if (file.path.search(reg) === 0) {
    return file.path.match(reg)[2];
  }
  else {
    return file.path;
  }
};

/**
 * Returns a preview image for this media player.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @param {string} type The type of image.
 * @param {function} callback Called when the image is retrieved.
 */
minplayer.players.youtube.getImage = function(file, type, callback) {
  type = (type == 'thumbnail') ? '1' : '0';
  callback('http://img.youtube.com/vi/' + file.id + '/' + type + '.jpg');
};

/**
 * Translates the player state for the YouTube API player.
 *
 * @param {number} playerState The YouTube player state.
 */
minplayer.players.youtube.prototype.setPlayerState = function(playerState) {
  switch (playerState) {
    case YT.PlayerState.CUED:
      break;
    case YT.PlayerState.BUFFERING:
      this.onWaiting();
      break;
    case YT.PlayerState.PAUSED:
      this.onPaused();
      break;
    case YT.PlayerState.PLAYING:
      this.onPlaying();
      break;
    case YT.PlayerState.ENDED:
      this.onComplete();
      break;
    default:
      break;
  }
};

/**
 * Called when an error occurs.
 *
 * @param {string} event The onReady event that was triggered.
 */
minplayer.players.youtube.prototype.onReady = function(event) {
  minplayer.players.base.prototype.onReady.call(this);
  if (!this.options.autoplay) {
    this.pause();
  }
  this.onLoaded();
};

/**
 * Checks to see if this player can be found.
 * @return {bool} TRUE - Player is found, FALSE - otherwise.
 */
minplayer.players.youtube.prototype.playerFound = function() {
  var id = 'iframe#' + this.options.id + '-player.youtube-player';
  var iframe = this.display.find(id);
  return (iframe.length > 0);
};

/**
 * Called when the player state changes.
 *
 * @param {object} event A JavaScript Event.
 */
minplayer.players.youtube.prototype.onPlayerStateChange = function(event) {
  this.setPlayerState(event.data);
};

/**
 * Called when the player quality changes.
 *
 * @param {string} newQuality The new quality for the change.
 */
minplayer.players.youtube.prototype.onQualityChange = function(newQuality) {
  this.quality = newQuality.data;
};

/**
 * Determines if the player should show the playloader.
 *
 * @param {string} preview The preview image.
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.youtube.prototype.hasPlayLoader = function(preview) {
  return minplayer.hasTouch || !preview;
};

/**
 * Determines if the player should show the controller.
 *
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.youtube.prototype.hasController = function() {
  return minplayer.isIDevice;
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.youtube.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);

  // Insert the YouTube iframe API player.
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/player_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Get the player ID.
  this.playerId = this.options.id + '-player';

  // Poll until the YouTube API is ready.
  this.poll((function(player) {
    return function() {
      var ready = jQuery('#' + player.playerId).length > 0;
      ready = ready && ('YT' in window);
      ready = ready && (typeof YT.Player == 'function');
      if (ready) {
        // Determine the origin of this script.
        jQuery('#' + player.playerId).addClass('youtube-player');
        var origin = location.protocol;
        origin += '//' + location.hostname;
        origin += (location.port && ':' + location.port);

        var playerVars = {};
        if (minplayer.isIDevice) {
          playerVars.origin = origin;
        }
        else {
          playerVars = {
            enablejsapi: minplayer.isIDevice ? 0 : 1,
            origin: origin,
            wmode: 'opaque',
            controls: minplayer.isAndroid ? 1 : 0
          };
        }

        // Create the player.
        player.player = new YT.Player(player.playerId, {
          height: '100%',
          width: '100%',
          frameborder: 0,
          videoId: player.mediaFile.id,
          playerVars: playerVars,
          events: {
            'onReady': function(event) {
              player.onReady(event);
            },
            'onStateChange': function(event) {
              player.onPlayerStateChange(event);
            },
            'onPlaybackQualityChange': function(newQuality) {
              player.onQualityChange(newQuality);
            },
            'onError': function(errorCode) {
              player.onError(errorCode);
            }
          }
        });
      }
      return !ready;
    };
  })(this), 200);

  // Return the player.
  return jQuery(document.createElement('div')).attr({
    id: this.playerId
  });
};

/**
 * @see minplayer.players.base#load
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.load = function(file) {
  if (minplayer.players.base.prototype.load.call(this, file)) {
    this.player.loadVideoById(file.id, 0, this.quality);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#play
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.play = function() {
  if (minplayer.players.base.prototype.play.call(this)) {
    this.onWaiting();
    this.player.playVideo();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#pause
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.pause = function() {
  if (minplayer.players.base.prototype.pause.call(this)) {
    this.player.pauseVideo();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#stop
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.stop = function() {
  if (minplayer.players.base.prototype.stop.call(this)) {
    this.player.stopVideo();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#seek
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.seek = function(pos) {
  if (minplayer.players.base.prototype.seek.call(this, pos)) {
    this.onWaiting();
    this.player.seekTo(pos, true);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#setVolume
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.setVolume = function(vol) {
  if (minplayer.players.base.prototype.setVolume.call(this, vol)) {
    this.player.setVolume(vol * 100);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.youtube.prototype.getVolume = function(callback) {
  this.getValue('getVolume', callback);
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.youtube.prototype.getDuration = function(callback) {
  this.getValue('getDuration', callback);
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.youtube.prototype.getCurrentTime = function(callback) {
  this.getValue('getCurrentTime', callback);
};

/**
 * @see minplayer.players.base#getBytesStart.
 */
minplayer.players.youtube.prototype.getBytesStart = function(callback) {
  this.getValue('getVideoStartBytes', callback);
};

/**
 * @see minplayer.players.base#getBytesLoaded.
 */
minplayer.players.youtube.prototype.getBytesLoaded = function(callback) {
  this.getValue('getVideoBytesLoaded', callback);
};

/**
 * @see minplayer.players.base#getBytesTotal.
 */
minplayer.players.youtube.prototype.getBytesTotal = function(callback) {
  this.getValue('getVideoBytesTotal', callback);
};
