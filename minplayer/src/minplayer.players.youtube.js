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
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.youtube.getPriority = function(file) {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.youtube.canPlay = function(file) {

  // Check for the mimetype for youtube.
  if (file.mimetype === 'video/youtube') {
    return true;
  }

  // If the path is a YouTube path, then return true.
  var regex = /^http(s)?\:\/\/(www\.)?(youtube\.com|youtu\.be)/i;
  return (file.path.search(regex) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.youtube.getMediaId = function(file) {
  var regex = '^http[s]?\\:\\/\\/(www\\.)?';
  regex += '(youtube\\.com\\/watch\\?v=|youtu\\.be\\/)';
  regex += '([a-zA-Z0-9_\\-]+)';
  var reg = RegExp(regex, 'i');

  // Locate the media id.
  if (file.path.search(reg) === 0) {
    return file.path.match(reg)[3];
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
  type = (type === 'thumbnail') ? '1' : '0';
  callback('https://img.youtube.com/vi/' + file.id + '/' + type + '.jpg');
};

/**
 * Parse a single playlist node.
 *
 * @param {object} item The youtube item.
 * @return {object} The mediafront node.
 */
minplayer.players.youtube.parseNode = function(item) {
  var node = (typeof item.video !== 'undefined') ? item.video : item;
  return {
    title: node.title,
    description: node.description,
    mediafiles: {
      image: {
        'thumbnail': {
          path: node.thumbnail.sqDefault
        },
        'image': {
          path: node.thumbnail.hqDefault
        }
      },
      media: {
        'media': {
          player: 'youtube',
          id: node.id
        }
      }
    }
  };
};

/**
 * Returns information about this youtube video.
 *
 * @param {object} file The file to load.
 * @param {function} callback Called when the node is loaded.
 */
minplayer.players.youtube.getNode = function(file, callback) {
  var url = 'https://gdata.youtube.com/feeds/api/videos/' + file.id;
  url += '?v=2&alt=jsonc';
  jQuery.get(url, function(data) {
    callback(minplayer.players.youtube.parseNode(data.data));
  });
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
minplayer.players.youtube.prototype.createPlayer = function() {
  minplayer.players.base.prototype.createPlayer.call(this);

  // Insert the YouTube iframe API player.
  var youtube_script = 'https://www.youtube.com/player_api';
  if (jQuery('script[src="' + youtube_script + '"]').length === 0) {
    var tag = document.createElement('script');
    tag.src = youtube_script;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Get the player ID.
  this.playerId = this.options.id + '-player';

  // Poll until the YouTube API is ready.
  this.poll(this.options.id + '_youtube', (function(player) {
    return function() {
      var ready = jQuery('#' + player.playerId).length > 0;
      ready = ready && ('YT' in window);
      ready = ready && (typeof YT.Player === 'function');
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
            controls: minplayer.isAndroid ? 1 : 0,
            rel: 0,
            showinfo: 0
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
 */
minplayer.players.youtube.prototype.load = function(file, callback) {
  minplayer.players.base.prototype.load.call(this, file, function() {
    this.player.loadVideoById(file.id, 0, this.quality);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.youtube.prototype.play = function(callback) {
  minplayer.players.base.prototype.play.call(this, function() {
    this.onWaiting();
    this.player.playVideo();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.youtube.prototype.pause = function(callback) {
  minplayer.players.base.prototype.pause.call(this, function() {
    this.player.pauseVideo();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.youtube.prototype.stop = function(callback) {
  minplayer.players.base.prototype.stop.call(this, function() {
    this.player.stopVideo();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.youtube.prototype.seek = function(pos, callback) {
  minplayer.players.base.prototype.seek.call(this, pos, function() {
    this.onWaiting();
    this.player.seekTo(pos, true);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.youtube.prototype.setVolume = function(vol, callback) {
  minplayer.players.base.prototype.setVolume.call(this, vol, function() {
    this.player.setVolume(vol * 100);
    if (callback) {
      callback.call(this);
    }
  });
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
  if (this.options.duration) {
    callback(this.options.duration);
  }
  else {
    this.getValue('getDuration', callback);
  }
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
