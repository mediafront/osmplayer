/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class A class to easily handle images.
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.image = function(context, options) {

  // Determine if the image is loaded.
  this.loaded = false;

  // The image loader.
  this.loader = null;

  // The ratio of the image.
  this.ratio = 0;

  // The image element.
  this.img = null;

  // Derive from display
  minplayer.display.call(this, 'image', context, options);
};

/** Derive from minplayer.display. */
minplayer.image.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.image.prototype.constructor = minplayer.image;

/**
 * @see minplayer.plugin.construct
 */
minplayer.image.prototype.construct = function() {

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Set the plugin name within the options.
  this.options.pluginName = 'image';

  // Set the container to not show any overflow...
  this.display.css('overflow', 'hidden');

  /** The loader for the image. */
  this.loader = new Image();

  /** Register for when the image is loaded within the loader. */
  this.loader.onload = (function(image) {
    return function() {
      image.loaded = true;
      image.ratio = (image.loader.width / image.loader.height);
      image.resize();
      image.trigger('loaded');
    };
  })(this);

  // We are now ready.
  this.ready();
};

/**
 * Loads an image.
 *
 * @param {string} src The source of the image to load.
 */
minplayer.image.prototype.load = function(src) {

  // First clear the previous image.
  this.clear(function() {

    // Create the new image, and append to the display.
    this.display.empty();
    this.img = jQuery(document.createElement('img')).attr({src: ''}).hide();
    this.display.append(this.img);
    this.loader.src = src;
    this.img.attr('src', src);
  });
};

/**
 * Clears an image.
 *
 * @param {function} callback Called when the image is done clearing.
 */
minplayer.image.prototype.clear = function(callback) {
  this.loaded = false;
  if (this.img) {
    this.img.fadeOut((function(image) {
      return function() {
        image.img.attr('src', '');
        image.loader.src = '';
        jQuery(this).remove();
        callback.call(image);
      };
    })(this));
  }
  else {
    callback.call(this);
  }
};

/**
 * Resize the image provided a width and height or nothing.
 *
 * @param {integer} width (optional) The width of the container.
 * @param {integer} height (optional) The height of the container.
 */
minplayer.image.prototype.resize = function(width, height) {
  width = width || this.display.parent().width();
  height = height || this.display.parent().height();
  if (width && height && this.loaded) {

    // Get the scaled rectangle.
    var rect = this.getScaledRect(this.ratio, {
      width: width,
      height: height
    });

    // Now set this image to the new size.
    if (this.img) {
      this.img.attr('src', this.loader.src).css({
        marginLeft: rect.x,
        marginTop: rect.y,
        width: rect.width,
        height: rect.height
      });
    }

    // Show the container.
    this.img.fadeIn();
  }
};

/**
 * @see minplayer.display#onResize
 */
minplayer.image.prototype.onResize = function() {

  // Resize the image to fit.
  this.resize();
};
