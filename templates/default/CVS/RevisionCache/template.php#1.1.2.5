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

class DefaultTemplate extends OSMTemplate {
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
      'useThemeRoller' => true,

      /**
       * The template specific JavaScript files required for this template.
       */
      'jsFiles' => array(

        /**
         * The release template JavaScript file(s).  Usually a compressed version of the debug version.
         */
        'release' => array(
          'templates/default/jquery.media.template.default.compressed.js'
        ),

        /**
         * The debug template JavaScript file(s) ( uncompressed ).
         */
        'debug' => array(
          'templates/default/jquery.media.template.default.js'
        )
      ),

      /**
       * The CSS files used for this template.
       */
      'cssFiles' => array(
        'theme' => $this->getThemeRollerCSS(),
        'template' => 'templates/default/osmplayer_default.css',
        'template_ie' => 'templates/default/osmplayer_default_ie.css'
      ),

      /**
       * The ID's for this template.  This is used to map certain HTML elements
       * of your template to the functionality behind the Open Standard Media Player.
       */
      'ids' => array(
        'loading' => '#mediaplayerloading',
        'player' => '#mediaplayer',
        'menu' => '#mediamenu',
        'titleBar' => '#mediatitlebar',
        'node' => '#medianode',
        'playlist' => '#mediaplaylist',
        'currentTime' => '#mediacurrenttime',
        'totalTime' => '#mediatotaltime',
        'playPause' => '#mediaplaypause',
        'seekUpdate' => '#mediaseekupdate',
        'seekProgress' => '#mediaseekprogress',
        'seekBar' => '#mediaseekbar',
        'seekHandle' => '#mediaseekhandle',
        'volumeUpdate' => '#mediavolumeupdate',
        'volumeBar' => '#mediavolumebar',
        'volumeHandle' => '#mediavolumehandle',
        'mute' => '#mediamute',
        'linkText' => '#medialinktext',
        'linkScroll' => '#medialinkscroll',
        'close' => '#mediamenuclose',
        'embed' => '#mediaembed',
        'elink' => '#mediaelink',
        'email' => '#mediaemail',
        'busy' => '#mediabusy',
        'preview' => '#mediapreview',
        'play' => '#mediaplay',
        'media' => '#mediadisplay',
        'control' => '#mediacontrol',
        'voter' => '#mediavoter',
        'uservoter' => '#mediauservoter',
        'mediaRegion' => '#mediaregion',
        'field' => '.mediafield',
        'prev' => '#mediaprev',
        'next' => '#medianext',
        'loadPrev' => '#medialoadprev',
        'loadNext' => '#medialoadnext',
        'prevPage' => '#mediaprevpage',
        'nextPage' => '#medianextpage',
        'pager' => '#mediapager',
        'scroll' => '#mediascroll',
        'busy' => '#mediabusy',
        'links' => '#medialinks',
        'listMask' => '#medialistmask',
        'list' => '#medialist',
        'scrollWrapper' => '#mediascrollbarwrapper',
        'scrollBar' => '#mediascrollbar',
        'scrollTrack' => '#mediascrolltrack',
        'scrollHandle' => '#mediascrollhandle',
        'scrollUp' => '#mediascrollup',
        'scrollDown' => '#mediascrolldown',
        'titleLinks' => '#mediatitlelinks'
      )
    );
  }


  /**
   * A theme preprocess function for the main player.
   */
  public function theme_preprocess( &$variables ) {
    $variables['titlebar'] = $this->theme( $variables,  '_titlebar' );
    $variables['menu'] = $this->theme( $variables,  '_menu' );
    $variables['node'] = $this->theme( $variables,  '_node' );
    $variables['playlist'] = $this->theme( $variables,  '_playlist' );
  }

  /**
   * A theme preprocess function for the node.
   */
  public function theme_preprocess_node( &$variables ) {
    $variables['controlBar'] = $this->theme( $variables,  '_controlbar' );
  }

  /**
   * A theme preprocess function for the menu.
   */
  public function theme_preprocess_menu( &$variables ) {
    $variables['version'] = $this->getVersion();
  }

  /**
   * A theme preprocess function for the control bar.
   */
  public function theme_preprocess_controlbar( &$variables ) {
    $variables['voter'] = $this->theme( $variables,  '_nodevoter' );
  }

  /**
   * A theme preprocess function for the teaser.
   */
  public function theme_preprocess_teaser( &$variables ) {
    $variables['teaservoter'] = $this->theme( $variables,  '_teaservoter' );
  }

  /**
   * A theme preprocess function for the playlist.
   */
  public function theme_preprocess_playlist( &$variables ) {
    $variables['teaser'] = $this->theme( $variables,  '_teaser' );

    if( $variables['params']['vertical'] ) {
      $variables['scrollBar'] = $this->theme( $variables,  '_scrollbar' );
    }
    else {
      $variables['scrollBar'] = $this->theme( $variables,  '_hscrollbar' );
    }

    $variables['links'] = $variables['params']['links'] ? theme( $variables,  '_links' ) : '';
    $variables['pager'] = $this->theme( $variables,  '_pager' );
  }
}
?>
