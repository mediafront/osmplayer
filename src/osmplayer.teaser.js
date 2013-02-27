/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides teaser functionality.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.teaser = function(context, options) {

  /** The preview image. */
  this.preview = null;

  // Derive from display
  minplayer.display.call(this, 'teaser', context, options);
};

/** Derive from minplayer.display. */
osmplayer.teaser.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.teaser.prototype.constructor = osmplayer.teaser;

/**
 * Selects the teaser.
 *
 * @param {boolean} selected TRUE if selected, FALSE otherwise.
 */
osmplayer.teaser.prototype.select = function(selected) {
};

/**
 * Sets the node.
 *
 * @param {object} node The node object to set.
 */
osmplayer.teaser.prototype.setNode = function(node) {

  // Add this to the node info for this teaser.
  this.node = node;

  // Set the title of the teaser.
  if (this.elements.title) {
    if (node.title) {
      this.elements.title.text(node.title);
    }
    else {
      osmplayer.getNode(node, (function(teaser) {
        return function(node) {
          teaser.elements.title.text(node.title);
        };
      })(this));
    }
  }

  // Load the thumbnail image if it exists.
  if (node.mediafiles) {
    osmplayer.getImage(node.mediafiles, 'thumbnail', (function(teaser) {
      return function(image) {
        if (image && teaser.elements.image) {
          teaser.preview = new minplayer.image(teaser.elements.image);
          teaser.preview.load(image.path);
        }
      };
    })(this));
  }

  // Bind when they click on this teaser.
  this.display.unbind('click').click((function(teaser) {
    return function(event) {
      event.preventDefault();
      teaser.trigger('nodeLoad', teaser.node);
    };
  })(this));
};
