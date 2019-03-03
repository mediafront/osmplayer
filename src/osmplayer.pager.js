/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides pager functionality.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.pager = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'pager', context, options);
};

/** Derive from minplayer.display. */
osmplayer.pager.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.pager.prototype.constructor = osmplayer.pager;

/**
 * @see minplayer.plugin#construct
 */
osmplayer.pager.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Setup the prev button.
  if (this.elements.prevPage) {
    this.prevPage = this.elements.prevPage.click((function(pager) {
      return function(event) {
        event.preventDefault();
        pager.trigger('prevPage');
      };
    })(this));
  }

  // Setup the next button.
  if (this.elements.nextPage) {
    this.nextPage = this.elements.nextPage.click((function(pager) {
      return function(event) {
        event.preventDefault();
        pager.trigger('nextPage');
      };
    })(this));
  }
};
