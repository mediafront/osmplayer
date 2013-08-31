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
minplayer.players.kaltura = function(context, options) {

  // Derive from the base player.
  minplayer.players.base.call(this, context, options);
};

/** Derive from minplayer.players.base. */
minplayer.players.kaltura.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.kaltura.prototype.constructor = minplayer.players.kaltura;

/**
 * @see minplayer.plugin.construct
 * @this minplayer.kaltura.limelight
 */
minplayer.players.kaltura.prototype.construct = function() {

  // Call the players.base constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'kaltura';
};

/**
 * Get the default options for this plugin.
 *
 * @param {object} options The default options for this plugin.
 */
minplayer.players.kaltura.prototype.defaultOptions = function(options) {

  // The Kaltura options for this player.
  options.entryId = 0;
  options.uiConfId = 0;
  options.partnerId = 0;

  minplayer.players.base.prototype.defaultOptions.call(this, options);
};

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.kaltura.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.kaltura.canPlay = function(file) {

  // Check for the mimetype for kaltura.
  if (file.mimetype === 'video/kaltura') {
    return true;
  }

  // If the path is a kaltura path, then return true.
  var regex = /.*kaltura\.com.*/i;
  return (file.path.search(regex) === 0);
};

/**
 * Keep track when the player state changes.
 *
 * @param {type} data
 * @returns {undefined}
 */
minplayer.players.kaltura.prototype.playerStateChange = function(data) {
  switch (data) {
    case 'ready':
      this.onLoaded();
      break;
    case 'loading':
    case 'buffering':
      this.onWaiting();
      break;
    case 'playing':
      this.onPlaying();
      break;
    case 'paused':
      this.onPaused();
      break;
  }
};

/**
 * Called when the player is ready.
 *
 * @returns {undefined}
 */
minplayer.players.kaltura.prototype.mediaReady = function() {
  this.onLoaded();
};

/**
 * Called when the media ends.
 *
 * @param {type} data
 * @returns {undefined}
 */
minplayer.players.kaltura.prototype.playerPlayEnd = function(data) {
  this.onComplete();
};

/**
 * Called as the play updates.
 *
 * @param {type} data
 * @returns {undefined}
 */
minplayer.players.kaltura.prototype.playUpdate = function(data) {
  this.currentTime.set(data);
};

/**
 * Called when the duration changes.
 *
 * @param {type} data
 * @returns {undefined}
 */
minplayer.players.kaltura.prototype.durationChange = function(data) {
  this.duration.set(data.newValue);
};

/**
 * Returns the name of this player instance.
 *
 * @returns {String}
 */
minplayer.players.kaltura.prototype.getInstance = function() {
  if (this.instanceName) {
    return this.instanceName;
  }
  var ids = this.uuid.split('__');
  var instance = 'minplayer.plugins.' + ids[0];
  instance += '.' + ids[1];
  instance += '[' + (ids[2] - 1) + ']';
  this.instanceName = instance;
  return instance;
};

/**
 * Register for the media player events.
 *
 * @returns {undefined}
 */
minplayer.players.kaltura.prototype.registerEvents = function() {
  this.player.addJsListener("playerStateChange", this.getInstance() + '.playerStateChange');
  this.player.addJsListener("durationChange", this.getInstance() + '.durationChange');
  this.player.addJsListener("mediaReady", this.getInstance() + '.mediaReady');
  this.player.addJsListener("playerUpdatePlayhead", this.getInstance() + '.playUpdate');
  this.player.addJsListener("playerPlayEnd", this.getInstance() + '.playerPlayEnd');
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.kaltura.prototype.createPlayer = function() {
  minplayer.players.base.prototype.createPlayer.call(this);

  // Set the items.
  var settings = {};
  var self = this;
  jQuery.each(['entryId', 'uiConfId', 'partnerId'], function(index, item) {
    settings[item] = '';
    if (self.options[item]) {
      settings[item] = self.options[item];
    }
    else {
      var regex = null;
      switch (item) {
        case 'entryId':
          regex = /.*kaltura\.com.*entry_id\/([a-zA-Z0-9_-]+)/i;
          break;
        case 'uiConfId':
          regex = /.*kaltura\.com.*uiconf_id\/([a-zA-Z0-9_-]+)/i;
          break;
        case 'partnerId':
          regex = /.*kaltura\.com.*wid\/_([a-zA-Z0-9_-]+)/i;
          break;
      }

      // Set the value for this item.
      if (regex) {
        settings[item] = self.mediaFile.path.match(regex);
        if (settings[item]) {
          settings[item] = settings[item][1];
        }
      }
    }
  });

  // Insert the embed javascript.
  var tag = document.createElement('script');
  tag.src = 'http://cdnapi.kaltura.com/p/';
  tag.src += settings.partnerId;
  tag.src += '/sp/';
  tag.src += settings.partnerId;
  tag.src += '00/embedIframeJs/uiconf_id/';
  tag.src += settings.uiConfId;
  tag.src += '/partner_id/';
  tag.src += settings.partnerId;
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // The player Id.
  var playerId = this.options.id + '-player';

  // Check the embed code every second.
  setTimeout(function checkKaltura() {
    if (window.hasOwnProperty('kWidget')) {
      kWidget.embed({
        'targetId': playerId,
	'wid': '_' + settings.partnerId,
	'uiconf_id' : settings.uiConfId,
	'entry_id' : settings.entryId,
	'flashvars':{
          'autoPlay': false
        },
        'params':{
          'wmode': 'transparent'
        },
        readyCallback: function( playerId ){
          self.player = jQuery('#' + playerId).get(0);
          self.registerEvents();
          self.onReady();
        }
      });
    }
    else {
      setTimeout(checkKaltura, 1000);
    }
  }, 1000);

  // Return a div tag.
  return '<div id="' + playerId + '" style="width:100%;height:100%;"></div>';
};

/**
 * @see minplayer.players.base#play
 */
minplayer.players.kaltura.prototype.play = function(callback) {
  minplayer.players.base.prototype.play.call(this, function() {
    this.player.sendNotification("doPlay");
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#pause
 */
minplayer.players.kaltura.prototype.pause = function(callback) {
  minplayer.players.base.prototype.pause.call(this, function() {
    this.player.sendNotification("doPause");
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#stop
 */
minplayer.players.kaltura.prototype.stop = function(callback) {
  minplayer.players.base.prototype.stop.call(this, function() {
    this.player.sendNotification("doStop");
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#seek
 */
minplayer.players.kaltura.prototype.seek = function(pos, callback) {
  minplayer.players.base.prototype.seek.call(this, pos, function() {
    this.seekValue = pos;
    this.player.sendNotification("doSeek", pos);
    if (callback) {
      callback.call(this);
    }
  });
};

/**
 * @see minplayer.players.base#setVolume
 */
minplayer.players.kaltura.prototype.setVolume = function(vol, callback) {
  minplayer.players.base.prototype.setVolume.call(this, vol, function() {
    this.player.sendNotification("changeVolume", vol);
    if (callback) {
      callback.call(this);
    }
  });
};
