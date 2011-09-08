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

class OSMTemplate
{
  // The version of this player.
  private $version = '';

  // The prefix for this template.
  private $prefix = '';

  // The cache for the settings of this player.
  public $settings = array();

  // The CSS directory to store the cached templates in.
  private $css_dir = '';

  // The player settings.
  protected $playerSettings = array();

  // The default id's for the osm media player.
  public $defaultIds = array(
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
  );

  /**
   * Constructor for the OSMTempalate class.
   */
  public function __construct( $playerSettings ) {
    // Set the player settings, which can be used in this template.
    $this->playerSettings = $playerSettings;

    // Get the settings for our template
    $this->settings = $this->getSettings();
  }

  /**
   * Get's the player version number.
   */
  public function getVersion() {
    $this->version = $this->version ? $this->version : file_get_contents( dirname(__FILE__) . '/version.txt' );
    return $this->version;
  }

  /**
   * Return's this templates settings.  This function is used to tell the Open Standard Media Player class
   * about your template.
   */
  public function getSettings() {
    // We must have a template derive from this class... set all settings to null.
    return array();
  }

  /**
   * Returns the CSS file that is located within the current theme.
   */
  public function getThemeRollerCSS() {
    $theme_css = '';
    if( $this->playerSettings['theme'] ) {
      $theme_folder = 'jquery-ui/css/' . $this->playerSettings['theme'];

      // Now search this folder for the CSS file...
      $theme_path = dirname(__FILE__) . '/' . $theme_folder;
      if (is_dir($theme_path)) {
        if ($contents = opendir($theme_path)) {
          while(($node = readdir($contents)) !== false) {
            if( preg_match('/\.css$/', $node) ) {
              $theme_css = $node;
              break;
            }
          }
        }
      }
    }

    // Add the theme.
    return $theme_css ? ($theme_folder . '/' . $theme_css) : '';
  }

  /**
   * Set the CSS directory for this media player.
   */
  public function setCSSDir( $dir ) {
    // We only want to set this if we are using themeroller since
    // this directory can change to a cached directory when the
    // themeroller file is created.
    if( $this->settings['generateCSS'] ) {
      $this->css_dir = $dir;
    }
  }

  /**
   * Resets all generated CSS files.
   */
  public function resetCSS() {
    $this->deleteCSS();
    $this->createCSS();
  }

  /**
   * Get the CSS header for this player.
   */
  public function getCSSHeader() {
    $playerPath = $this->playerSettings['playerPath'];

    // Add the CSS files.
    $css_files = $this->getCSSFiles();
    $header = '<link rel="stylesheet" type="text/css" href="' . $playerPath . $css_files['template'] . '" />';
    $header .= "\n";
    if( isset($css_files['template_ie']) ) {
      $header .= '<!--[if IE]><link rel="stylesheet" type="text/css" href="' . $playerPath . $css_files['template_ie'] . '" /><![endif]-->';
      $header .= "\n";
    }

    // Return the header.
    return $header;
  }

  /**
   * Get an array of the CSS files for this player.
   */
  public function getCSSFiles() {
    $files = array();

    // If they are using theme roller, then we will use the cached CSS files.
    if( $this->settings['generateCSS'] ) {
      // Get the CSS path.
      $css_path = $this->css_dir ? $this->css_dir : dirname(__FILE__);
      $css_local_path = $this->css_dir ? '' : 'css/';

      // Cache the prefix name.
      $id = $this->playerSettings['id'];

      // The CSS files for this id.
      $files['template'] = $css_local_path . "{$id}.css";
      $files['template_ie'] = $css_local_path . "{$id}_ie.css";

      // If the CSS files do not exist, then create them.
      if( !is_file( $css_path . '/' . $files['template'] ) ) {
        $this->createCSS();
      }
    }
    else {
      $files = $this->settings['cssFiles'];
    }

    // Return the CSS files.
    return $files;
  }

  /**
   * Writes the contents of one CSS file to another, but also replaces all the id's and
   * class names to take into account the prefix ( id ) of the media player.
   */
  private function writeCSS( $css, $handle ) {
    // Get the file contents and length.
    $contents = file_get_contents( dirname(__FILE__) . '/' . $css);

    // Change all of the images to the correct path...
    $playerPath = $this->playerSettings['playerPath'] ? $this->playerSettings['playerPath'] : '../';
    $contents = str_replace( 'images/', $playerPath . str_replace( basename($css), '', $css ) . 'images/', $contents );

    // Locate all of the z-index elements.
    $contents = preg_replace_callback('/z-index\s*:\s*([0-9]+)/', create_function(
      '$match',
      '$zIndex = intval($match[1]);
       return $zIndex ? "z-index:" . (' . $this->playerSettings['zIndex'] . ' + $zIndex) : $zIndex;'
    ), $contents);

    // Get the length of the contents.
    $len = strlen( $contents );

    // Make sure we don't overwrite anything within brackets...
    $match = 0;
    $matches = array();
    preg_match_all('/\{.*\}/sU', $contents, $matches, PREG_OFFSET_CAPTURE);

    if( count($matches[0]) > 0 ) {
      $match_len = strlen( $matches[0][$match][0] );
    }

    // Iterate through all the characters.
    for( $i=0; $i<$len; $i++ ) {

      // See if we need to increment the current match.
      if( isset( $matches[0][$match+1] ) && ($i > $matches[0][$match+1][1]) ) {
        $match++;
        $match_len = strlen( $matches[0][$match][0] );
      }

      // Get the char at this index.
      $char = $contents[$i];

      // If this is a class or an id, and is not within brackets...
      if( (($char == '#') || ($char == '.')) &&
        !(($i > $matches[0][$match][1]) && ($i <= ($matches[0][$match][1]+$match_len))) ) {
        fwrite( $handle, $char . $this->playerSettings['id'] . '_' );
      }
      else {
        fwrite( $handle, $char );
      }
    }
  }

  /**
   * Create the CSS files for this media player.  This will dynamically rename all the
   * id's and class names within the master CSS files ( theme and template ), and then create
   * a cached version of them within the css folder.
   */
  public function createCSS() {
    // This is only necessary if they are using Theme Roller.
    if( $this->settings['generateCSS'] ) {
      // Store the CSS directory for later usage.
      $dir = $this->css_dir ? $this->css_dir : dirname(__FILE__) . '/css';

      // Make sure this directory exists.
      if( !is_dir( $dir ) ) {
        // Create the directory.
        mkdir( $dir, 0777, true );
      }

      // Now make sure the directory has the right permissions.
      @chmod( $dir, 0777 );

      // Store the to path and to css.
      $to_path = $dir . '/' . $this->playerSettings['id'];
      $to_css = $to_path . '.css';

      // Setup the files array.
      $files = array();
      $files[$to_css] = array();
      if( $this->settings['cssFiles']['theme'] ) {
        $files[$to_css][] = $this->settings['cssFiles']['theme'];
      }
      if( $this->settings['cssFiles']['template'] ) {
        $files[$to_css][] = $this->settings['cssFiles']['template'];
      }
      if( $this->settings['cssFiles']['template_ie'] ) {
        $files[$to_path . '_ie.css'] = array( $this->settings['cssFiles']['template_ie'] );
      }

      // Iterate through all of our css files we need to create.
      foreach( $files as $file => $contents ) {
        // Now open up the new css file.
        $handle = fopen( $file, 'a+' );
        if( $handle ) {
          // Iterate through all the files that will be combined to
          // create this css file.
          foreach( $contents as $content ) {
            if( $content ) {
              // Write to the css file.
              $this->writeCSS( $content, $handle );
            }
          }

          // Close the file.
          fclose( $handle );
        }

        // Now set the file permissions to 775.
        @chmod( $file, 0777 );
      }
    }
  }

  /**
   * Delete the current cached CSS files.
   */
  public function deleteCSS() {
    // This is only necessary if they user Theme Roller.
    if( $this->settings['generateCSS'] ) {
      $css_path = $this->css_dir ? $this->css_dir : dirname(__FILE__) . '/css';
      $css_path .= '/' . $this->playerSettings['id'];
      $css = $css_path . '.css';

      if( is_file( $css ) ) {
        @chmod( $css, 0775 );
        unlink( $css );
      }

      $css = $css_path . '_ie.css';
      if( is_file( $css ) ) {
        @chmod( $css, 0775 );
        unlink( $css );
      }
    }
  }

  /**
   * Returns the id's for this template.
   */
  public function getIds() {
    $ids = array();

    // Only add the prefix if the template is using themeroller.
    if( $this->settings['generateCSS'] ) {
      // Iterate through all the id's and add the id.
      foreach( $this->settings['ids'] as $index => $id ) {
        $ids[$index] = $id[0] . $this->prefix . substr( $id, 1 );
      }
    }
    else {
      $ids = $this->settings['ids'];
    }

    // Return the id's with the prefix's in place.
    return $ids;
  }

  /**
   * Set's the prefix of the template.
   */
  public function setPrefix( $newPrefix ) {
    // Set the prefix for this template.
    $this->prefix = $newPrefix;
  }

  /**
   * Theme function for the base template class.
   *
   * @param array $variables - The variables used within this particular theme.
   * @param string $subtemplate - The subtemplate to include.
   * @return string The HTML markup of this theme.
   */
  public function theme( $variables, $subtemplate = '' )
  {
    $template = $variables['params']['template'];
    $preprocess = 'theme_preprocess' . $subtemplate;
    if( method_exists( $this, $preprocess ) ) {
      $this->{$preprocess}( $variables );
    }

    // Extract the variables to a local namespace
    extract($variables, EXTR_SKIP);

    // Start output buffering
    ob_start();

    // Include the template.
    include "templates/{$template}/osmplayer_{$template}{$subtemplate}.tpl.php";

    // Get the contents of the buffer
    $contents = ob_get_contents();

    // End buffering and discard
    ob_end_clean();

    // Return the contents
    return $contents;
  }
}
?>
