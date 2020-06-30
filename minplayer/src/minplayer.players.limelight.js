/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The Limelight media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.players.limelight = function(context, options) {

  // Derive from players base.
  minplayer.players.flash.call(this, context, options);
};

/** Derive from minplayer.players.flash. */
minplayer.players.limelight.prototype = new minplayer.players.flash();

/** Reset the constructor. */
minplayer.players.limelight.prototype.constructor = minplayer.players.limelight;

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.limelight
 */
minplayer.players.limelight.prototype.construct = function() {

  // Call the players.flash constructor.
  minplayer.players.flash.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'limelight';
};

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.limelight.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.limelight.canPlay = function(file) {

  // Check for the mimetype for limelight.
  if (file.mimetype === 'video/limelight') {
    return true;
  }

  // If the path is a limelight path, then return true.
  var regex = /.*limelight\.com.*/i;
  return (file.path.search(regex) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.limelight.getMediaId = function(file) {
  var regex = /.*limelight\.com.*mediaId=([a-zA-Z0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.match(regex)[1];
  }
  else {
    return file.path;
  }
};

/**
 * Register this limelight player so that multiple players can be present
 * on the same page without event collision.
 */
minplayer.players.limelight.prototype.register = function() {

  // Register the limelight player.
  window.delvePlayerCallback = function(playerId, event, data) {

    // Get the main player ID.
    var id = playerId.replace('-player', '');

    // Dispatch this event to the correct player.
    jQuery.each(minplayer.get(id, 'media'), function(key, media) {
      media.onMediaUpdate(event, data);
    });
  };
};

/**
 * The media update method.
 *
 * @param {string} event The event that was triggered.
 * @param {object} data The event object.
 */
minplayer.players.limelight.prototype.onMediaUpdate = function(event, data) {

  // Switch on the event name.
  switch (event) {
    case 'onPlayerLoad':
      this.onReady();
      break;

    case 'onMediaLoad':
      // If this media has already completed, then pause it and return...
      if (this.complete) {
        this.pause();
        this.onPaused();
        return;
      }

      this.shouldSeek = (this.getSeek() > 0);
      this.onLoaded();
      break;

    case 'onMediaComplete':
      this.complete = true;
      this.onComplete();
      break;

    case 'onPlayheadUpdate':

      // Make sure we say this is playing.
      if (data.positionInMilliseconds && !this.playing && !this.complete) {
        this.onPlaying();
      }

      // Set the complete flag to false.
      this.complete = false;

      // Set the duration and current time.
      if (this.shouldSeek && this.seekValue) {
        this.shouldSeek = false;
        this.seek(this.seekValue);
      }
      else {
        this.duration.set(data.durationInMilliseconds / 1000);
        this.currentTime.set(data.positionInMilliseconds / 1000);
      }
      break;

    case 'onError':
      this.onError();
      break;

    case 'onPlayStateChanged':
      if (data.isPlaying) {
        this.onPlaying();
      }
      else if (data.isBusy) {
        this.onWaiting();
      }
      else {
        this.onPaused();
      }
      break;
  }
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.limelight.prototype.createPlayer = function() {
  minplayer.players.flash.prototype.createPlayer.call(this);

  // Insert the embed.js.
  var tag = document.createElement('script');
  tag.src = 'https://assets.delvenetworks.com/player/embed.js';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Now register this player.
  this.register();

  // Get the FlashVars.
  var flashVars = {
    'deepLink': 'true',
    'autoplay': this.options.autoplay ? 'true' : 'false',
    'startQuality': 'HD'
  }, regex = null;

  // Get the channel for this player.
  var channel = this.options.channel;
  if (!channel) {
    regex = /.*limelight\.com.*channelId=([a-zA-Z0-9]+)/i;
    if (this.mediaFile.path.search(regex) === 0) {
      channel = this.mediaFile.path.match(regex)[1];
    }
  }

  // Set the channel.
  if (channel && this.mediaFile.queueType === 'media') {
    flashVars.adConfigurationChannelId = channel;
  }

  // Get the playerForm for this player.
  var playerForm = this.options.playerForm;
  if (!playerForm) {
    regex = /.*limelight\.com.*playerForm=([a-zA-Z0-9]+)/i;
    if (this.mediaFile.path.search(regex) === 0) {
      playerForm = this.mediaFile.path.match(regex)[1];
    }
  }

  // Set the player form.
  if (playerForm) {
    flashVars.playerForm = playerForm;
  }

  // Add the media Id to the flashvars.
  flashVars.mediaId = this.mediaFile.id;

  // Set the player ID.
  var playerId = this.options.id + '-player';

  // Check the embed code every second.
  setTimeout(function checkLimelight() {
    if (window.hasOwnProperty('LimelightPlayerUtil')) {
      window.LimelightPlayerUtil.initEmbed(playerId);
    }
    else {
      setTimeout(checkLimelight, 1000);
    }
  }, 1000);

  // Return a flash media player object.
  return this.getFlash({
    swf: 'https://assets.delvenetworks.com/player/loader.swf',
    id: playerId,
    width: this.options.width,
    height: '100%',
    flashvars: flashVars,
    wmode: this.options.wmode
  });
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.limelight.prototype.play = function(callback) {
  minplayer.players.flash.prototype.play.call(this, function() {
    this.player.doPlay();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.limelight.prototype.pause = function(callback) {
  minplayer.players.flash.prototype.pause.call(this, function() {
    this.player.doPause();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.limelight.prototype.stop = function(callback) {
  minplayer.players.flash.prototype.stop.call(this, function() {
    this.player.doPause();
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.limelight.prototype.seek = function(pos, callback) {
  minplayer.players.flash.prototype.seek.call(this, pos, function() {
    this.seekValue = pos;
    this.player.doSeekToSecond(pos);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.limelight.prototype.setVolume = function(vol, callback) {
  minplayer.players.flash.prototype.setVolume.call(this, vol, function() {
    this.player.doSetVolume(vol);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.limelight.prototype.getVolume = function(callback) {
  this.whenReady(function() {
    callback(this.player.doGetVolume());
  });
};

/**
 * Perform the Limelight Search Inside.
 *
 * @param {string} query The query to search for.
 */
minplayer.players.limelight.prototype.search = function(query) {
  this.whenReady(function() {
    this.player.doSearch(query);
  });
};
