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
require_once( $base_path . '/OSMTemplate.php');

class SimpleblackTemplate extends OSMTemplate {
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
      'useThemeRoller' => false,

      /**
       * The template specific JavaScript files required for this template.
       */
      'jsFiles' => array(

        /**
         * The release template JavaScript file(s).  Usually a compressed version of the debug version.
         */
        'release' => array(
          'templates/simpleblack/jquery.media.template.simpleblack.js'
        ),

        /**
         * The debug template JavaScript file(s) ( uncompressed ).
         */
        'debug' => array(
          'templates/simpleblack/jquery.media.template.simpleblack.js'
        )
      ),

      /**
       * The CSS files used for this template.
       */
      'cssFiles' => array(
        'template' => 'templates/simpleblack/css/simpleblack.css'
      ),

      /**
       * The ID's for this template.  This is used to map certain HTML elements
       * of your template to the functionality behind the Open Standard Media Player.
       */
      'ids' => array(
        'loading' => '#mediaplayerloading',
        'player' => '#mediaplayer',
        'menu' => '#mediafront_informationbox',
        'node' => '#mediafront_playerWrap',
        'currentTime' => '#mediafront_playtime',
        'totalTime' => '#mediafront_totaltime',
        'playPause' => '#mediafront_play_pause',
        'seekUpdate' => '#mediafront_progressBar_update',
        'seekProgress' => '#mediafront_progressBar_controler',
        'seekBar' => '#mediafront_progressBar',
        'volumeBar' => '#mediafront_audioBarWrap',
        'volumeHandle' => '#mediafront_audioControler',
        'mute' => '#mediafront_audioButton',
        'close' => '#mediafront_inforboxClose',
        'embed' => '#mediafront_embed',
        'elink' => '#mediafront_link',
        'busy' => '#mediabusy',
        'preview' => '#mediafront_preview',
        'play' => '#mediafront_bigPlay',
        'media' => '#mediadisplay',
        'control' => '#mediafront_controlerBarWrap',
        'mediaRegion' => '#mediafront_movieFrame',
      )
    );
  }
}
?>
