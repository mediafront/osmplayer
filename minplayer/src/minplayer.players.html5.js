/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The HTML5 media player implementation.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.html5 = function(context, options, queue) {

  // Derive players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.html5.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.html5.prototype.constructor = minplayer.players.html5;

/**
 * @see minplayer.players.base#getPriority
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.html5.getPriority = function(file) {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.html5.canPlay = function(file) {
  switch (file.mimetype) {
    case 'video/ogg':
      return !!minplayer.playTypes.videoOGG;
    case 'video/mp4':
    case 'video/x-mp4':
    case 'video/m4v':
    case 'video/x-m4v':
      return !!minplayer.playTypes.videoH264;
    case 'application/vnd.apple.mpegurl':
      return !!minplayer.playTypes.videoMPEGURL;
    case 'video/x-webm':
    case 'video/webm':
    case 'application/octet-stream':
      return !!minplayer.playTypes.videoWEBM;
    case 'audio/ogg':
      return !!minplayer.playTypes.audioOGG;
    case 'audio/mpeg':
      return !!minplayer.playTypes.audioMP3;
    case 'audio/mp4':
      return !!minplayer.playTypes.audioMP4;
    default:
      return false;
  }
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.players.html5.prototype.construct = function() {

  // Call base constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'html5';

  // Add the player events.
  this.addPlayerEvents();
};

/**
 * Adds a new player event.
 *
 * @param {string} type The type of event being fired.
 * @param {function} callback Called when the event is fired.
 */
minplayer.players.html5.prototype.addPlayerEvent = function(type, callback) {
  if (this.player) {

    // Add an event listener for this event type.
    this.player.addEventListener(type, (function(player) {

      // Get the function name.
      var func = type + 'Event';

      // If the callback already exists, then remove it from the player.
      if (player[func]) {
        player.player.removeEventListener(type, player[func], false);
      }

      // Create a new callback.
      player[func] = function(event) {
        callback.call(player, event);
      };

      // Return the callback.
      return player[func];

    })(this), false);
  }
};

/**
 * Add events.
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.addPlayerEvents = function() {

  // Check if the player exists.
  if (this.player) {

    this.addPlayerEvent('abort', function() {
      this.trigger('abort');
    });
    this.addPlayerEvent('loadstart', function() {
      this.onReady();
      if (!this.options.autoload) {
        this.onLoaded();
      }
    });
    this.addPlayerEvent('loadeddata', function() {
      this.onLoaded();
    });
    this.addPlayerEvent('loadedmetadata', function() {
      this.onLoaded();
    });
    this.addPlayerEvent('canplaythrough', function() {
      this.onLoaded();
    });
    this.addPlayerEvent('ended', function() {
      this.onComplete();
    });
    this.addPlayerEvent('pause', function() {
      this.onPaused();
    });
    this.addPlayerEvent('play', function() {
      this.onPlaying();
    });
    this.addPlayerEvent('playing', function() {
      this.onPlaying();
    });

    var errorSent = false;
    this.addPlayerEvent('error', function() {
      if (!errorSent && this.player) {
        errorSent = true;
        this.trigger('error', 'An error occured - ' + this.player.error.code);
      }
    });

    this.addPlayerEvent('waiting', function() {
      this.onWaiting();
    });
    this.addPlayerEvent('durationchange', function() {
      if (this.player) {
        this.duration.set(this.player.duration);
        this.trigger('durationchange', {duration: this.player.duration});
      }
    });
    this.addPlayerEvent('progress', function(event) {
      this.bytesTotal.set(event.total);
      this.bytesLoaded.set(event.loaded);
    });
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#onReady
 */
minplayer.players.html5.prototype.onReady = function() {
  minplayer.players.base.prototype.onReady.call(this);

  // Android just say we are loaded here.
  if (minplayer.isAndroid) {
    this.onLoaded();
  }

  // iOS devices are strange in that they don't autoload.
  if (minplayer.isIDevice) {
    setTimeout((function(player) {
      return function() {
        player.pause();
        player.onLoaded();
      };
    })(this), 1);
  }
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.html5.prototype.playerFound = function() {
  return (this.display.find(this.mediaFile.type).length > 0);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.html5.prototype.createPlayer = function() {
  minplayer.players.base.prototype.createPlayer.call(this);
  var element = jQuery(document.createElement(this.mediaFile.type))
  .attr(this.options.attributes)
  .append(
    jQuery(document.createElement('source')).attr({
      'src': this.mediaFile.path
    })
  );

  // Fix the fluid width and height.
  element.eq(0)[0].setAttribute('width', '100%');
  element.eq(0)[0].setAttribute('height', '100%');
  var option = this.options.autoload ? 'metadata' : 'none';
  option = minplayer.isIDevice ? 'metadata' : option;
  element.eq(0)[0].setAttribute('preload', option);

  // Make sure that we trigger onReady if autoload is false.
  if (!this.options.autoload) {
    element.eq(0)[0].setAttribute('autobuffer', false);
  }

  return element;
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.html5.prototype.getPlayer = function() {
  return this.elements.media.eq(0)[0];
};

/**
 * @see minplayer.players.base#load
 *
 * @param {object} file A {@link minplayer.file} object.
 */
minplayer.players.html5.prototype.load = function(file, callback) {

  // See if a load is even necessary.
  minplayer.players.base.prototype.load.call(this, file, function() {

    // Get the current source.
    var src = this.elements.media.attr('src');
    if (!src) {
      src = jQuery('source', this.elements.media).eq(0).attr('src');
    }

    // Only swap out if the new file is different from the source.
    if (src !== file.path) {

      // Add a new player.
      this.addPlayer();

      // Set the new player.
      this.player = this.getPlayer();

      // Add the events again.
      this.addPlayerEvents();

      // Change the source...
      var code = '<source src="' + file.path + '"></source>';
      this.elements.media.removeAttr('src').empty().html(code);
      if (callback) {
        callback.call(this);
      }
    }
  });
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.html5.prototype.play = function(callback) {
  minplayer.players.base.prototype.play.call(this, function() {
    this.player.play();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.html5.prototype.pause = function(callback) {
  minplayer.players.base.prototype.pause.call(this, function() {
    this.player.pause();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.html5.prototype.stop = function(callback) {
  minplayer.players.base.prototype.stop.call(this, function() {
    this.player.pause();
    this.player.src = '';
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.html5.prototype.seek = function(pos, callback) {
  minplayer.players.base.prototype.seek.call(this, pos, function() {
    this.player.currentTime = pos;
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.html5.prototype.setVolume = function(vol, callback) {
  minplayer.players.base.prototype.setVolume.call(this, vol, function() {
    this.player.volume = vol;
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.html5.prototype.getVolume = function(callback) {
  this.whenReady(function() {
    callback(this.player.volume);
  });
};

/**
 * @see minplayer.players.base#getDuration
 */
minplayer.players.html5.prototype.getDuration = function(callback) {
  this.whenReady(function() {
    if (this.options.duration) {
      callback(this.options.duration);
    }
    else {
      this.duration.get(callback);
      if (this.player.duration) {
        this.duration.set(this.player.duration);
      }
    }
  });
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.html5.prototype.getCurrentTime = function(callback) {
  this.whenReady(function() {
    callback(this.player.currentTime);
  });
};

/**
 * @see minplayer.players.base#getBytesLoaded
 */
minplayer.players.html5.prototype.getBytesLoaded = function(callback) {
  this.whenReady(function() {
    var loaded = 0;

    // Check several different possibilities.
    if (this.bytesLoaded.value) {
      loaded = this.bytesLoaded.value;
    }
    else if (this.player.buffered &&
        this.player.buffered.length > 0 &&
        this.player.buffered.end &&
        this.player.duration) {
      loaded = this.player.buffered.end(0);
    }
    else if (this.player.bytesTotal !== undefined &&
             this.player.bytesTotal > 0 &&
             this.player.bufferedBytes !== undefined) {
      loaded = this.player.bufferedBytes;
    }

    // Return the loaded amount.
    callback(loaded);
  });
};

/**
 * @see minplayer.players.base#getBytesTotal
 */
minplayer.players.html5.prototype.getBytesTotal = function(callback) {
  this.whenReady(function() {
    var total = 0;

    // Check several different possibilities.
    if (this.bytesTotal.value) {
      total = this.bytesTotal.value;
    }
    else if (this.player.buffered &&
        this.player.buffered.length > 0 &&
        this.player.buffered.end &&
        this.player.duration) {
      total = this.player.duration;
    }
    else if (this.player.bytesTotal !== undefined &&
             this.player.bytesTotal > 0 &&
             this.player.bufferedBytes !== undefined) {
      total = this.player.bytesTotal;
    }

    // Return the loaded amount.
    callback(total);
  });
};
