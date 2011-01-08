/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/**
 * This file serves as an API documentation on the javascript template file that is used
 * to govern special functionality of your template.  This system uses a hook system where
 * special hooks are called during certain key moments in the media players functionality
 * that allows you to hook in and add your own speical functionality to your template.
 * Please read all comments below on what you will need to provide in your template to
 * implement special funcitonality.
 *
 * Step 1:  First, you will need to copy this file, and rename it as
 *          jquery.media.template.{YOUR_TEMPLATE_NAME}.js
 */
(function($) {
  jQuery.media = jQuery.media ? jQuery.media : {};

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {

  });

  jQuery.media.templates = jQuery.extend( {}, {
    
    /**
     * Here you will need to change the name of {YOUR_TEMPLATE_NAME} to the name
     * of your template.
     */
    "{YOUR_TEMPLATE_NAME}" : function( mediaplayer, settings ) {

      // Return the template
      return new (function( mediaplayer, settings ) {

        // Get the settings for this media player.
        settings = jQuery.media.utils.getSettings(settings);

        // So that we can access this from any scope.
        var _this = this;

        /**
         * Initialize our template.
         *
         * @param - The settings object.
         */
        this.initialize = function( settings ) {};

        /**
         * Returns our template settings overrides.
         *
         * @return - An associative array of our settings.  We can use this to override any
         *           default settings for the player as well as default ids.
         */
        this.getSettings = function() { return {}; };

        /**
         * Called when the user presses the menu button.
         *
         * @param - If the menu should be on (true) or off (false).
         */
        this.onMenu = function( on ) {};

        /**
         * Called when the user presses the maximize button.
         *
         * @param - If the player should be maximized (true) or not (false).
         * @param - Boolean if this operation should be tweened or not.
         */
        this.onMaximize = function( on ) {};

        /**
         * Called when the user presses the fullscreen button.
         *
         * @param - If the player is in fullscreen (true) or normal mode (false).
         */
        this.onFullScreen = function( on ) {};

        /**
         * Allows the template to handle media events.
         *
         * @param - The media event.
         *             event.type - The event type.
         *             event.data - The data passed from this event.
         */
        this.onMediaUpdate = function( event ) {};

        /**
         * Allows the template to handle control bar events.
         *
         * @param - The control event.
         *             event.type - The event type.
         *             event.data - The data passed from this event.
         */
        this.onControlUpdate = function( event ) {};

        /**
         * Called when the player resizes.
         */
        this.onResize = function() {};

        /**
         * Allows the template to do something custom when the node has finished loading.
         *
         * @param - The node object.
         */
        this.onNodeLoad = function( node ) {};

        /**
         * Allows the template to do something custom when the playlist has finished loading.
         *
         * @param - The playlist object
         */
        this.onPlaylistLoad = function( playlist ) {};

        /**
         * Selects or Deselects a menu item.
         */
        this.onMenuSelect = function( link, contents, selected ) {};

        /**
         * Called when the link is hovered over.
         *
         * @param - The link object passed to this function.
         *
         * @return - none
         */
        this.onLinkOver = function( link ) {};

        /**
         * Called when the mouse moves out of the link.
         *
         * @param - The link object passed to this function.
         *
         * @return - none
         */
        this.onLinkOut = function( link ) {};

        /**
         * Called when the user selects a link.
         *
         * @param - The link object passed to this function.
         * @param - Boolean to see if the link is selected or not.
         *
         * @return - none
         */
        this.onLinkSelect = function( link, select ) {};

        /**
         * Called when the teaser has loaded..
         *
         * @param - The teaser object passed to this function.
         *    teaser.node - The teaser node object.
         *    teaser.index - The index in the playlist array.
         *
         * @return - none
         */
        this.onTeaserLoad = function( teaser ) {};

        /**
         * Called when the teaser is hovered over.
         *
         * @param - The teaser object passed to this function.
         *    teaser.node - The teaser node object.
         *    teaser.index - The index in the playlist array.
         *
         * @return - none
         */
        this.onTeaserOver = function( teaser ) {};

        /**
         * Called when the mouse moves out of the teaser.
         *
         * @param - The teaser object passed to this function.
         *    teaser.node - The teaser node object.
         *    teaser.index - The index in the playlist array.
         *
         * @return - none
         */
        this.onTeaserOut = function( teaser ) {};

        /**
         * Called when a teaser has been selected.
         *
         * @param - The teaser object passed to this function.
         *    teaser.node - The teaser node object.
         *    teaser.index - The index in the playlist array.
         *
         * @param - Boolean to determine if the teaser is selected or not.
         *
         * @return - none
         */
        this.onTeaserSelect = function( teaser, selected ) {};

        /**
         * Called when a teaser has been activated.
         *
         * @param - The teaser object passed to this function.
         *    teaser.node - The teaser node object.
         *    teaser.index - The index in the playlist array.
         *
         * @param - Boolean to determine if the teaser is active or not.
         *
         * @return - none
         */
        this.onTeaserActivate = function( teaser, active ) {};

        /**
         * Template function used to update a vote value.
         *
         * @param - The voter object.
         * @param - The current vote value.
         * @param - If this is a hover update.
         */
        this.updateVote = function( voter, voteValue, hover ) {};

        /**
         * This function is currently stubbed out.
         * You can implement it and hook into the time display by
         * reassigning this as follows...
         *
         *  this.formatTime = function( time ) {
         *  }
         */
        this.formatTime = false;
      })( mediaplayer, settings );
    }
  }, jQuery.media.templates );
})(jQuery);