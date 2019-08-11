(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // Define the controller object.
  osmplayer.controller = osmplayer.controller || {};

  /**
   * Constructor for the minplayer.controller
   */
  osmplayer.controller[template] = function(context, options) {

    // Derive from default controller
    minplayer.controller.call(this, context, options);
  };

  /** Derive from controller. */
  osmplayer.controller[template].prototype = new minplayer.controller();
  osmplayer.controller[template].prototype.constructor = osmplayer.controller[template];

  /**
   * @see minplayer.plugin#construct
   */
  osmplayer.controller[template].prototype.construct = function() {
    minplayer.controller.prototype.construct.call(this);
    if (!this.options.controllerOnly) {
      this.get('player', function(player) {
        this.get('media', function(media) {
          if (!media.hasController()) {
            this.showThenHide(5000, function(shown) {
              var op = shown ? 'addClass' : 'removeClass';
              player.display[op]('with-controller');
            });
          }
          else {
            player.display.addClass('with-controller');
          }
        });
      });
    }
  }

  /**
   * Return the display for this plugin.
   */
  osmplayer.controller[template].prototype.getDisplay = function() {

    // See if we need to build out the controller.
    if (this.options.build) {

      // Prepend the control template.
      jQuery('#mediaplayer_minplayer', this.context).append('\
      <div id="mediaplayer_control">\
        <div id="mediaplayer_controlLeft">\
          <div id="mediaplayer_playPause" class="mediaplayer_controlspace">\
            <div id="mediaplayer_play" class="on"><span>play</span></div>\
            <div id="mediaplayer_pause" class="off"><span>pause</span></div>\
          </div>\
          <div id="mediafront_playtime" class="mediaplayer_controlspace">00:00</div>\
        </div>\
        <div id="mediaplayer_controlRight">\
          <a id="mediafront_resizeScreen" class="mediaplayerlink mediaplayer_controlspace" href="#fullscreen">\
            <div id="mediafront_resize_to_fullScreen" class="on"><span>make full screen</span></div>\
            <div id="mediafront_resize_to_normalScreen" class="off"><span>make normal screen</span></div>\
          </a>\
          <div id="mediafront_totaltime" class="mediaplayer_controlspace">00:00</div>\
          <div id="mediafront_audio" class="mediaplayer_controlspace">\
             <div id="mediaplayer_audioButton"></div>\
             <div id="mediaplayer_audioBar"></div>\
          </div>\
          <a id="mediafront_information" class="mediaplayerlink mediaplayer_controlspace" href="#menu">\
            <div id="mediafront_menuButton"><span>information</span></div>\
          </a>\
        </div>\
        <div id="mediaplayer_seekBar">\
          <div id="mediaplayer_seekProgress"></div>\
        </div>\
      </div>');
    }

    // Let our template know we have a controller.
    this.context.addClass('with-controller');
    return jQuery('#mediaplayer_control', this.context);
  }

  // Return the elements
  osmplayer.controller[template].prototype.getElements = function() {
    var elements = minplayer.controller.prototype.getElements.call(this);
    return jQuery.extend(elements, {
      play: jQuery('#mediaplayer_play', this.display),
      pause: jQuery('#mediaplayer_pause', this.display),
      fullscreen: jQuery('#mediafront_resizeScreen', this.display),
      seek: jQuery('#mediaplayer_seekBar', this.display),
      progress: jQuery('#mediaplayer_seekProgress', this.display),
      volume: jQuery('#mediaplayer_audioBar', this.display),
      mute: jQuery('#mediaplayer_audioButton', this.display),
      timer: jQuery('#mediafront_playtime', this.display),
      duration: jQuery('#mediafront_totaltime', this.display)
    });
  };
})('simpleblack', osmplayer);
