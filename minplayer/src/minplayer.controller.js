/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This is the base minplayer controller.  Other controllers can derive
 * from the base and either build on top of it or simply define the elements
 * that this base controller uses.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.controller = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'controller', context, options);
};

/** Derive from minplayer.display. */
minplayer.controller.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.controller.prototype.constructor = minplayer.controller;

/**
 * A static function that will format a time value into a string time format.
 *
 * @param {integer} time An integer value of time.
 * @return {string} A string representation of the time.
 */
minplayer.formatTime = function(time) {
  time = time || 0;
  var seconds = 0, minutes = 0, hour = 0, timeString = '';

  hour = Math.floor(time / 3600);
  time -= (hour * 3600);
  minutes = Math.floor(time / 60);
  time -= (minutes * 60);
  seconds = Math.floor(time % 60);

  if (hour) {
    timeString += String(hour);
    timeString += ':';
  }

  timeString += (minutes >= 10) ? String(minutes) : ('0' + String(minutes));
  timeString += ':';
  timeString += (seconds >= 10) ? String(seconds) : ('0' + String(seconds));
  return {time: timeString, units: ''};
};

/**
 * @see minplayer.display#getElements
 * @return {object} The elements defined by this display.
 */
minplayer.controller.prototype.getElements = function() {
  var elements = minplayer.display.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    play: null,
    pause: null,
    fullscreen: null,
    seek: null,
    progress: null,
    volume: null,
    timer: null
  });
};

/**
 * @see minplayer.plugin#construct
 */
minplayer.controller.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'controller';

  // Keep track of if we are dragging...
  this.dragging = false;

  // Keep track of the current volume.
  this.vol = 0;

  // If they have a seek bar.
  if (this.elements.seek) {

    // Create the seek bar slider control.
    this.seekBar = this.elements.seek.slider({
      range: 'min',
      create: function(event, ui) {
        jQuery('.ui-slider-range', event.target).addClass('ui-state-active');
      }
    });
  }

  // If they have a volume bar.
  if (this.elements.volume) {

    // Create the volume bar slider control.
    this.volumeBar = this.elements.volume.slider({
      range: 'min',
      orientation: 'vertical'
    });
  }

  // Get the player plugin.
  this.get('player', function(player) {

    // If they have a fullscreen button.
    if (this.elements.fullscreen) {

      // Bind to the click event.
      minplayer.click(this.elements.fullscreen.unbind(), function() {
        player.toggleFullScreen();
      }).css({'pointer' : 'hand'});
    }
  });

  // Get the media plugin.
  this.get('media', function(media) {

    // Only bind if this player does not have its own play loader.
    if (!media.hasController()) {

      // If they have a pause button
      if (this.elements.pause) {

        // Bind to the click on this button.
        minplayer.click(this.elements.pause.unbind(), (function(controller) {
          return function(event) {
            event.preventDefault();
            controller.playPause(false, media);
          };
        })(this));

        // Bind to the pause event of the media.
        media.bind('pause', (function(controller) {
          return function(event) {
            controller.setPlayPause(true);
          };
        })(this));
      }

      // If they have a play button
      if (this.elements.play) {

        // Bind to the click on this button.
        minplayer.click(this.elements.play.unbind(), (function(controller) {
          return function(event) {
            event.preventDefault();
            controller.playPause(true, media);
          };
        })(this));

        // Bind to the play event of the media.
        media.bind('playing', (function(controller) {
          return function(event) {
            controller.setPlayPause(false);
          };
        })(this));
      }

      // If they have a duration, then trigger on duration change.
      if (this.elements.duration) {

        // Bind to the duration change event.
        media.bind('durationchange', (function(controller) {
          return function(event, data) {
            controller.setTimeString('duration', data.duration);
          };
        })(this));

        // Set the timestring to the duration.
        media.getDuration((function(controller) {
          return function(duration) {
            controller.setTimeString('duration', duration);
          };
        })(this));
      }

      // If they have a progress element.
      if (this.elements.progress) {

        // Bind to the progress event.
        media.bind('progress', (function(controller) {
          return function(event, data) {
            var percent = data.total ? (data.loaded / data.total) * 100 : 0;
            controller.elements.progress.width(percent + '%');
          };
        })(this));
      }

      // If they have a seek bar or timer, bind to the timeupdate.
      if (this.seekBar || this.elements.timer) {

        // Bind to the time update event.
        media.bind('timeupdate', (function(controller) {
          return function(event, data) {
            if (!controller.dragging) {
              var value = 0;
              if (data.duration) {
                value = (data.currentTime / data.duration) * 100;
              }

              // Update the seek bar if it exists.
              if (controller.seekBar) {
                controller.seekBar.slider('option', 'value', value);
              }

              controller.setTimeString('timer', data.currentTime);
            }
          };
        })(this));
      }

      // If they have a seekBar element.
      if (this.seekBar) {

        // Register the events for the control bar to control the media.
        this.seekBar.slider({
          start: (function(controller) {
            return function(event, ui) {
              controller.dragging = true;
            };
          })(this),
          stop: (function(controller) {
            return function(event, ui) {
              controller.dragging = false;
              media.getDuration(function(duration) {
                media.seek((ui.value / 100) * duration);
              });
            };
          })(this),
          slide: (function(controller) {
            return function(event, ui) {
              media.getDuration(function(duration) {
                var time = (ui.value / 100) * duration;
                if (!controller.dragging) {
                  media.seek(time);
                }
                controller.setTimeString('timer', time);
              });
            };
          })(this)
        });
      }

      // Setup the mute button.
      if (this.elements.mute) {
        minplayer.click(this.elements.mute, (function(controller) {
          return function(event) {
            event.preventDefault();
            var value = controller.volumeBar.slider('option', 'value');
            if (value > 0) {
              controller.vol = value;
              controller.volumeBar.slider('option', 'value', 0);
              media.setVolume(0);
            }
            else {
              controller.volumeBar.slider('option', 'value', controller.vol);
              media.setVolume(controller.vol / 100);
            }
          };
        })(this));
      }

      // Setup the volume bar.
      if (this.volumeBar) {

        // Create the slider.
        this.volumeBar.slider({
          slide: function(event, ui) {
            media.setVolume(ui.value / 100);
          }
        });

        media.bind('volumeupdate', (function(controller) {
          return function(event, vol) {
            controller.volumeBar.slider('option', 'value', (vol * 100));
          };
        })(this));

        // Set the volume to match that of the player.
        media.getVolume((function(controller) {
          return function(vol) {
            controller.volumeBar.slider('option', 'value', (vol * 100));
          };
        })(this));
      }
    }
    else {

      // Hide this controller.
      this.hide();
    }
  });

  // We are now ready.
  this.ready();
};

/**
 * Sets the play and pause state of the control bar.
 *
 * @param {boolean} state TRUE - Show Play, FALSE - Show Pause.
 */
minplayer.controller.prototype.setPlayPause = function(state) {
  var css = '';
  if (this.elements.play) {
    css = state ? 'inherit' : 'none';
    this.elements.play.css('display', css);
  }
  if (this.elements.pause) {
    css = state ? 'none' : 'inherit';
    this.elements.pause.css('display', css);
  }
};

/**
 * Plays or pauses the media.
 *
 * @param {bool} state true => play, false => pause.
 * @param {object} media The media player object.
 */
minplayer.controller.prototype.playPause = function(state, media) {
  var type = state ? 'play' : 'pause';
  this.display.trigger(type);
  this.setPlayPause(!state);
  if (media) {
    media[type]();
  }
};

/**
 * Sets the time string on the control bar.
 *
 * @param {string} element The name of the element to set.
 * @param {number} time The total time amount to set.
 */
minplayer.controller.prototype.setTimeString = function(element, time) {
  if (this.elements[element]) {
    this.elements[element].text(minplayer.formatTime(time).time);
  }
};
