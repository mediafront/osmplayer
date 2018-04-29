<?php
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

class ShockplayerTemplate extends OSMTemplate {
  /**
   * Return's this templates settings.  This function is used to tell the Open Standard Media Player class
   * about your template.
   */
  public function getSettings() {
    return array(
      /**
       * Boolean variable to tell this template if you are using theme roller.  This will basically
       * generate new CSS files so that multiple themes on the same page will not collide with each
       * other.
       */
      'generateCSS' => false,

      /**
       * The template specific JavaScript files required for this template.
       */
      'jsFiles' => array(

        /**
         * The release template JavaScript file(s).  Usually a compressed version of the debug version.
         */
        'release' => array(
          'templates/shockplayer/jquery.media.template.shockplayer.js'
        ),

        /**
         * The debug template JavaScript file(s) ( uncompressed ).
         */
        'debug' => array(
          'templates/shockplayer/jquery.media.template.shockplayer.js'
        )
      ),

      /**
       * The CSS files used for this template.
       */
      'cssFiles' => array(
        'template' => 'templates/shockplayer/css/shockplayer.css'
      ),

      /**
       * The ID's for this template.  This is used to map certain HTML elements
       * of your template to the functionality behind the Open Standard Media Player.
       */
      'ids' => array(
        'loading' => '#mediaplayerloading',
        'player' => '#mediaplayer',
        'menu' => '#mediaplayer_menu',
        'node' => '#mediaplayer_node',
        'currentTime' => '#mediafront_playtime',
        'totalTime' => '#mediafront_totaltime',
        'playPause' => '#mediaplayer_playPause',
        'seekBar' => '#mediaplayer_seekBar',
        'seekUpdate' => '#mediaplayer_seekUpdate',
        'seekProgress' => '#mediaplayer_seekProgress',
        'seekHandle' => '#mediaplayer_seekHandle',
        'volumeBar' => '#mediaplayer_audioBarInner',
        'volumeHandle' => '#mediafront_audioControler',
        'mute' => '#mediaplayer_audioButton',
        'close' => '#mediaplayer_menuClose',
        'embed' => '#mediaplayer_embed',
        'elink' => '#mediaplayer_link',
        'busy' => '#mediaplayer_busy',
        'preview' => '#mediaplayer_preview',
        'media' => '#mediaplayer_display',
        'control' => '#mediaplayer_control',
        'mediaRegion' => '#mediaplayer_minplayer'
      )
    );
  }
}
?>
