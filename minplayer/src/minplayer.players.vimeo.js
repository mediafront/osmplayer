/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The vimeo media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.vimeo = function(context, options, queue) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.vimeo.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.vimeo.prototype.constructor = minplayer.players.vimeo;

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.vimeo
 */
minplayer.players.vimeo.prototype.construct = function() {

  // Call the players.flash constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'vimeo';
};

/**
 * @see minplayer.players.base#getPriority
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.vimeo.getPriority = function(file) {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.vimeo.canPlay = function(file) {

  // Check for the mimetype for vimeo.
  if (file.mimetype === 'video/vimeo') {
    return true;
  }

  // If the path is a vimeo path, then return true.
  return (file.path.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i) === 0);
};

/**
 * Determines if the player should show the playloader.
 *
 * @param {string} preview The preview image.
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.vimeo.prototype.hasPlayLoader = function(preview) {
  return minplayer.hasTouch;
};

/**
 * Determines if the player should show the playloader.
 *
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.vimeo.prototype.hasController = function() {
  return minplayer.hasTouch;
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.vimeo.getMediaId = function(file) {
  var regex = /^http[s]?\:\/\/(www\.)?vimeo\.com\/(\?v\=)?([0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.match(regex)[3];
  }
  else {
    return file.path;
  }
};

/**
 * Parse a single playlist node.
 *
 * @param {object} item The vimeo item.
 * @return {object} The mediafront node.
 */
minplayer.players.vimeo.parseNode = function(item) {
  return {
    title: item.title,
    description: item.description,
    mediafiles: {
      image: {
        'thumbnail': {
          path: item.thumbnail_small
        },
        'image': {
          path: item.thumbnail_large
        }
      },
      media: {
        'media': {
          player: 'vimeo',
          id: item.id
        }
      }
    }
  };
};

/** Keep track of loaded nodes from vimeo. */
minplayer.players.vimeo.nodes = {};

/**
 * Returns information about this vimeo video.
 *
 * @param {object} file The file to get the node from.
 * @param {function} callback Callback when the node is loaded.
 */
minplayer.players.vimeo.getNode = function(file, callback) {
  if (minplayer.players.vimeo.nodes.hasOwnProperty(file.id)) {
    callback(minplayer.players.vimeo.nodes[file.id]);
  }
  else {
    jQuery.ajax({
      url: 'https://vimeo.com/api/v2/video/' + file.id + '.json',
      dataType: 'jsonp',
      success: function(data) {
        var node = minplayer.players.vimeo.parseNode(data[0]);
        minplayer.players.vimeo.nodes[file.id] = node;
        callback(node);
      }
    });
  }
};

/**
 * Returns a preview image for this media player.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @param {string} type The type of image.
 * @param {function} callback Called when the image is retrieved.
 */
minplayer.players.vimeo.getImage = function(file, type, callback) {
  minplayer.players.vimeo.getNode(file, function(node) {
    callback(node.mediafiles.image.image);
  });
};

/**
 * @see minplayer.players.base#reset
 */
minplayer.players.vimeo.prototype.reset = function() {

  // Reset the flash variables..
  minplayer.players.base.prototype.reset.call(this);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.vimeo.prototype.createPlayer = function() {
  minplayer.players.base.prototype.createPlayer.call(this);

  // Insert the Vimeo Froogaloop player.
  var vimeo_script = 'http://a.vimeocdn.com/js/froogaloop2.min.js';
  if (jQuery('script[src="' + vimeo_script + '"]').length === 0) {
    var tag = document.createElement('script');
    tag.src = vimeo_script;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Create the iframe for this player.
  var iframe = document.createElement('iframe');
  iframe.setAttribute('id', this.options.id + '-player');
  iframe.setAttribute('type', 'text/html');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');
  jQuery(iframe).addClass('vimeo-player');

  // Get the source.
  var src = 'https://player.vimeo.com/video/';
  src += this.mediaFile.id + '?';

  // Add the parameters to the src.
  src += jQuery.param({
    'wmode': 'opaque',
    'api': 1,
    'player_id': this.options.id + '-player',
    'title': 0,
    'byline': 0,
    'portrait': 0,
    'loop': this.options.loop
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Now register this player when the froogaloop code is loaded.
  this.poll(this.options.id + '_vimeo', (function(player) {
    return function() {
      if (window.Froogaloop) {
        player.player = window.Froogaloop(iframe);
        var playerTimeout = 0;
        player.player.addEvent('ready', function() {
          clearTimeout(playerTimeout);
          player.onReady();
          player.onError('');
        });
        playerTimeout = setTimeout(function() {
          player.onReady();
        }, 3000);
      }
      return !window.Froogaloop;
    };
  })(this), 200);

  // Trigger that the load has started.
  this.trigger('loadstart');

  // Return the player.
  return iframe;
};

/**
 * @see minplayer.players.base#onReady
 */
minplayer.players.vimeo.prototype.onReady = function(player_id) {

  // Add the other listeners.
  this.player.addEvent('loadProgress', (function(player) {
    return function(progress) {
      player.duration.set(parseFloat(progress.duration));
      player.bytesLoaded.set(progress.bytesLoaded);
      player.bytesTotal.set(progress.bytesTotal);
    };
  })(this));

  this.player.addEvent('playProgress', (function(player) {
    return function(progress) {
      player.duration.set(parseFloat(progress.duration));
      player.currentTime.set(parseFloat(progress.seconds));
    };
  })(this));

  this.player.addEvent('play', (function(player) {
    return function() {
      player.onPlaying();
    };
  })(this));

  this.player.addEvent('pause', (function(player) {
    return function() {
      player.onPaused();
    };
  })(this));

  this.player.addEvent('finish', (function(player) {
    return function() {
      player.onComplete();
    };
  })(this));

  minplayer.players.base.prototype.onReady.call(this);
  this.onLoaded();

  // Make sure we autoplay if it is set.
  if (this.options.autoplay) {
    this.play();
  }
};

/**
 * Clears the media player.
 */
minplayer.players.vimeo.prototype.clear = function() {
  if (this.player) {
    this.player.api('unload');
  }

  minplayer.players.base.prototype.clear.call(this);
};

/**
 * @see minplayer.players.base#load
 */
minplayer.players.vimeo.prototype.load = function(file, callback) {
  minplayer.players.base.prototype.load.call(this, file, function() {
    this.construct();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.vimeo.prototype.play = function(callback) {
  minplayer.players.base.prototype.play.call(this, function() {
    this.player.api('play');
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.vimeo.prototype.pause = function(callback) {
  minplayer.players.base.prototype.pause.call(this, function() {
    this.player.api('pause');
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.vimeo.prototype.stop = function(callback) {
  minplayer.players.base.prototype.stop.call(this, function() {
    this.player.api('unload');
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.vimeo.prototype.seek = function(pos, callback) {
  minplayer.players.base.prototype.seek.call(this, pos, function() {
    this.player.api('seekTo', pos);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.vimeo.prototype.setVolume = function(vol, callback) {
  minplayer.players.base.prototype.setVolume.call(this, vol, function() {
    this.volume.set(vol);
    this.player.api('setVolume', vol);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.vimeo.prototype.getVolume = function(callback) {
  this.whenReady(function() {
    this.player.api('getVolume', function(vol) {
      callback(vol);
    });
  });
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.vimeo.prototype.getDuration = function(callback) {
  this.whenReady(function() {
    if (this.options.duration) {
      callback(this.options.duration);
    }
    else if (this.duration.value) {
      callback(this.duration.value);
    }
    else {
      this.player.api('getDuration', function(duration) {
        callback(duration);
      });
    }
  });
};
