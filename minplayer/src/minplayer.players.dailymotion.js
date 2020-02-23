/*jshint maxlen:90 */

/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The Dailymotion media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.dailymotion = function(context, options, queue) {

  /** The quality of the Dailymotion stream. */
  this.quality = 'default';

  // Derive from players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.dailymotion.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.dailymotion.prototype.constructor = minplayer.players.dailymotion;

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.dailymotion
 */
minplayer.players.dailymotion.prototype.construct = function() {

  // Call the players.flash constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'dailymotion';
};

/**
 * @see minplayer.players.base#getPriority
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.dailymotion.getPriority = function(file) {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.dailymotion.canPlay = function(file) {

  // Check for the mimetype for dailymotion.
  if (file.mimetype === 'video/dailymotion') {
    return true;
  }

  // If the path is a Dailymotion path, then return true.
  var regex = /^http(s)?\:\/\/(www\.)?(dailymotion\.com)/i;
  return (file.path.search(regex) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.dailymotion.getMediaId = function(file) {
  var regex = '^http[s]?\\:\\/\\/(www\\.)?';
  regex += '(dailymotion\\.com\\/video/)';
  regex += '([a-z0-9\\-]+)';
  regex += '_*';
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
minplayer.players.dailymotion.getImage = function(file, type, callback) {
  callback('http://www.dailymotion.com/thumbnail/video/' + file.id);
};

/**
 * Parse a single playlist node.
 *
 * @param {object} item The dailymotion item.
 * @return {object} The mediafront node.
 */
minplayer.players.dailymotion.parseNode = function(item) {
  return {
    title: node.title,
    description: node.description,
    mediafiles: {
      image: {
        'thumbnail': {
          path: node.thumbnail_small_url
        },
        'image': {
          path: node.thumbnail_url
        }
      },
      media: {
        'media': {
          player: 'dailymotion',
          id: node.id
        }
      }
    }
  };
};

/**
 * Returns information about this dailymotion video.
 *
 * @param {object} file The file to load.
 * @param {function} callback Called when the node is loaded.
 */
minplayer.players.dailymotion.getNode = function(file, callback) {

  var url = 'https://api.dailymotion.com/video/' + file.id;
  url += '?fields=title,id,description,thumbnail_small_url,thumbnail_url';
  jQuery.get(url, function(data) {
    callback(minplayer.players.dailymotion.parseNode(data.data));
  }, 'jsonp');
};

/**
 * Called when an API is loaded and ready.
 *
 * @param {string} event The onReady event that was triggered.
 */
minplayer.players.dailymotion.prototype.onReady = function(event) {
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
minplayer.players.dailymotion.prototype.playerFound = function() {
  return (this.display.find(this.mediaFile.type).length > 0);
};

/**
 * Called when the player quality changes.
 *
 * @param {string} newQuality The new quality for the change.
 */
minplayer.players.dailymotion.prototype.onQualityChange = function(newQuality) {
  this.quality = newQuality.data;
};

/**
 * Determines if the player should show the playloader.
 *
 * @param {string} preview The preview image.
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.dailymotion.prototype.hasPlayLoader = function(preview) {
  return minplayer.hasTouch || !preview;
};

/**
 * Determines if the player should show the controller.
 *
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.dailymotion.prototype.hasController = function() {
  return minplayer.isIDevice;
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.dailymotion.prototype.createPlayer = function() {
  minplayer.players.base.prototype.createPlayer.call(this);

  // Insert the Dailymotion iframe API player.
  var dailymotion_script = document.location.protocol;
  dailymotion_script += '//api.dmcdn.net/all.js';
  if (jQuery('script[src="' + dailymotion_script + '"]').length === 0) {
    var tag = document.createElement('script');
    tag.src = dailymotion_script;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Get the player ID.
  this.playerId = this.options.id + '-player';

  // Poll until the Dailymotion API is ready.
  this.poll(this.options.id + '_dailymotion', (function(player) {
    return function() {
      var ready = jQuery('#' + player.playerId).length > 0;
      ready = ready && ('DM' in window);
      ready = ready && (typeof DM.player === 'function');
      if (ready) {
        // Determine the origin of this script.
        jQuery('#' + player.playerId).addClass('dailymotion-player');

        var params = {};
        params = {
          id: player.playerId,
          api: minplayer.isIDevice ? 0 : 1,
          wmode: 'opaque',
          controls: minplayer.isAndroid ? 1 : 0,
          related: 0,
          info: 0,
          logo: 0
        };


        // Create the player.
        player.player = new DM.player(player.playerId, {
          video: player.mediaFile.id,
          height: '100%',
          width: '100%',
          frameborder: 0,
          params: params
        });

        player.player.addEventListener('apiready', function() {
          player.onReady(player);
        });
        player.player.addEventListener('ended', function() {
          player.onComplete(player);
        });
        player.player.addEventListener('playing', function() {
          player.onPlaying(player);
        });
        player.player.addEventListener('progress', function() {
          player.onWaiting(player);
        });
        player.player.addEventListener('pause', function() {
          player.onPaused(player);
        });
        player.player.addEventListener('error', function() {
          player.onError(player);
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
minplayer.players.dailymotion.prototype.load = function(file, callback) {
  minplayer.players.base.prototype.load.call(this, file, function() {
    this.player.load(file.id);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.dailymotion.prototype.play = function(callback) {
  minplayer.players.base.prototype.play.call(this, function() {
    this.onWaiting();
    this.player.play();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.dailymotion.prototype.pause = function(callback) {
  minplayer.players.base.prototype.pause.call(this, function() {
    if (this.loaded) {
      this.player.pause();
      if (callback) {
        callback.call(this);
      }
    }
  });
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.dailymotion.prototype.stop = function(callback) {
  minplayer.players.base.prototype.stop.call(this, function() {
    this.player.pause();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.dailymotion.prototype.seek = function(pos, callback) {
  minplayer.players.base.prototype.seek.call(this, pos, function() {
    this.onWaiting();
    this.player.seek(pos);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.dailymotion.prototype.setVolume = function(vol, callback) {
  minplayer.players.base.prototype.setVolume.call(this, vol, function() {
    if (this.loaded) {
      this.player.setVolume(vol);
      if (callback !== undefined) {
        callback.call(this);
      }
    }
  });

};

/**
 * @see minplayer.players.base#getValue
 */
minplayer.players.dailymotion.prototype.getValue = function(getter, callback) {
  if (this.isReady()) {
    var value = this.player[getter];
    if ((value !== undefined) && (value !== null) && callback) {
      callback(value);
    }
  }
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.dailymotion.prototype.getVolume = function(callback) {
  this.getValue('volume', callback);
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.dailymotion.prototype.getDuration = function(callback) {
  if (this.options.duration && callback !== undefined) {
    callback(this.options.duration);
  }
  else {
    this.getValue('duration', callback);
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.dailymotion.prototype.getCurrentTime = function(callback) {
  this.getValue('currentTime', callback);
};
