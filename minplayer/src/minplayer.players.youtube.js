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
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.youtube.getPriority = function() {
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
  var regex = /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.match(regex)[2];
  }
  else {
    return file.path;
  }
};

/**
 * Register this youtube player so that multiple players can be present
 * on the same page without event collision.
 */
minplayer.players.youtube.prototype.register = function() {

  /**
   * Register the standard youtube api ready callback.
   */
  window.onYouTubePlayerAPIReady = function() {

    // Iterate over each media player.
    jQuery.each(minplayer.get(null, 'player'), function(id, player) {

      // Make sure this is the youtube player.
      if (player.currentPlayer == 'youtube') {

        // Create a new youtube player object for this instance only.
        var playerId = id + '-player';

        // Set this players media.
        player.media.player = new YT.Player(playerId, {
          events: {
            'onReady': function(event) {
              player.media.onReady(event);
            },
            'onStateChange': function(event) {
              player.media.onPlayerStateChange(event);
            },
            'onPlaybackQualityChange': function(newQuality) {
              player.media.onQualityChange(newQuality);
            },
            'onError': function(errorCode) {
              player.media.onError(errorCode);
            }
          }
        });
      }
    });
  }
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
  this.onLoaded();
};

/**
 * Checks to see if this player can be found.
 * @return {bool} TRUE - Player is found, FALSE - otherwise.
 */
minplayer.players.youtube.prototype.playerFound = function() {
  var iframe = this.display.find('iframe#' + this.options.id + '-player');
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
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.youtube.prototype.hasPlayLoader = function() {
  return true;
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.youtube.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);

  // Insert the YouTube iframe API player.
  var tag = document.createElement('script');
  tag.src = 'http://www.youtube.com/player_api?enablejsapi=1';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Now register this player.
  this.register();

  // Create the iframe for this player.
  var iframe = document.createElement('iframe');
  iframe.setAttribute('id', this.options.id + '-player');
  iframe.setAttribute('type', 'text/html');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');

  // Get the source.
  var src = 'http://www.youtube.com/embed/';
  src += this.mediaFile.id + '?';

  // Determine the origin of this script.
  var origin = location.protocol;
  origin += '//' + location.hostname;
  origin += (location.port && ':' + location.port);

  // Add the parameters to the src.
  src += jQuery.param({
    'wmode': 'opaque',
    'controls': 0,
    'enablejsapi': 1,
    'origin': origin,
    'autoplay': this.options.autoplay,
    'loop': this.options.loop
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Return the player.
  return iframe;
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.youtube.prototype.load = function(file) {
  minplayer.players.base.prototype.load.call(this, file);
  if (file && this.isReady()) {
    this.player.loadVideoById(file.id, 0, this.quality);
  }
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.youtube.prototype.play = function() {
  minplayer.players.base.prototype.play.call(this);
  if (this.isReady()) {
    this.player.playVideo();
  }
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.youtube.prototype.pause = function() {
  minplayer.players.base.prototype.pause.call(this);
  if (this.isReady()) {
    this.player.pauseVideo();
  }
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.youtube.prototype.stop = function() {
  minplayer.players.base.prototype.stop.call(this);
  if (this.isReady()) {
    this.player.stopVideo();
  }
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.youtube.prototype.seek = function(pos) {
  minplayer.players.base.prototype.seek.call(this, pos);
  if (this.isReady()) {
    this.player.seekTo(pos, true);
  }
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.youtube.prototype.setVolume = function(vol) {
  minplayer.players.base.prototype.setVolume.call(this, vol);
  if (this.isReady()) {
    this.player.setVolume(vol * 100);
  }
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.youtube.prototype.getVolume = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVolume());
  }
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.youtube.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    callback(this.player.getDuration());
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.youtube.prototype.getCurrentTime = function(callback) {
  if (this.isReady()) {
    callback(this.player.getCurrentTime());
  }
};

/**
 * @see minplayer.players.base#getBytesStart.
 */
minplayer.players.youtube.prototype.getBytesStart = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVideoStartBytes());
  }
};

/**
 * @see minplayer.players.base#getBytesLoaded.
 */
minplayer.players.youtube.prototype.getBytesLoaded = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVideoBytesLoaded());
  }
};

/**
 * @see minplayer.players.base#getBytesTotal.
 */
minplayer.players.youtube.prototype.getBytesTotal = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVideoBytesTotal());
  }
};
