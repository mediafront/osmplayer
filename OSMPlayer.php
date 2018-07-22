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

// Define the default width and height.
define('OSMPLAYER_DEFAULT_WIDTH', 550);
define('OSMPLAYER_DEFAULT_HEIGHT', 400);

/**
 * PHP wrapper class for the Open Standard Media (OSM) player.
 *
 * This class is used to wrap all the functionality behind the open standard media player
 * including the dynamic template system that this unique player employs.  This class can
 * be used to easily add and customize the OSM Player within a standalone PHP implementation.
 *
 * To learn how to use this class, please visit the online documentation at
 * http://www.mediafront.org/documentation.
 */
class OSMPlayer {
  // The complete settings of the media player.
  private $settings;

  // The playlists connected to this media player.
  private $playlists = array();

  // The controllers connected to this media player.
  private $controllers = array();

  // The template for this osm player instance.
  public $template = null;

  // Store the default settings.
  public $defaults = null;

  // To store the player parameters.
  private $playerParams = null;

  /**
   * Constructor.
   *
   * Creates a new instance of a media player.
   *
   * Usage:
   *
   *    $player = new OSMPlayer(array(
   *       'width' => 640,
   *       'height' => 480,
   *       'playlist' => 'http://www.mysite.com/playlist.xml'
   *    ));
   */
  public function __construct( $_params = array() ) {
    // First set the defaults.
    $this->playerParams = OSMPlayer::getPlayerParams();
    $this->defaults = array_merge( $this->playerParams, OSMPlayer::getPlayerSettings() );
    $this->settings = $this->defaults;
    if( $_params ) {
      // Set the parameters ( which will override the defaults ).
      $this->settings = array_merge( $this->settings, $_params );
    }

    // Create our template.
    $templateClass = ucfirst( $this->settings['template'] ) . 'Template';
    require_once( "OSMTemplate.php" );
    require_once( "templates/" . $this->settings['template'] . "/template.php" );
    $this->template = new $templateClass( $this->settings );

    // Make sure we set the Prefix.
    $this->setPrefix( isset($_params['prefix']) ? $_params['prefix'] : ($this->settings['id'] . '_') );
  }

  /**
   * Returns the paths to this player library.
   */
  public static function getPlayerPath() {
    static $playerPath;

    // Get the player path.
    if( !$playerPath ) {
      // Set the base path and url of this class.
      $base_root = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http';
      $base_url = $base_root .= '://'. $_SERVER['HTTP_HOST'];
      if ($dir = trim(dirname($_SERVER['SCRIPT_NAME']), '\,/')) {
         $base_url .= "/$dir";
      }

      $path = parse_url($base_url);
      $path = isset($path['path']) ? $path['path'] : '';
      $playerPath = trim( str_replace( realpath('.'), '', dirname(__FILE__) ), '/' );
      $playerPath = trim( str_replace('\\', '/', $playerPath), '/' );
      $playerPath = $playerPath ? $path . '/' . $playerPath . '/' : $playerPath;
    }

    // Return the player path.
    return $playerPath;
  }

  /**
   * Returns the player settings.
   */
  public static function getPlayerSettings() {
    return array(
      'width' => OSMPLAYER_DEFAULT_WIDTH,
      'height' => OSMPLAYER_DEFAULT_HEIGHT,
      'theme' => 'dark-hive',
      'version' => '0.01',
      'showController' => true,
      'disablePlaylist' => false,
      'playlistOnly' => false,
      'showNodeVoter' => false,
      'showTeaserVoter' => false,
      'showTitleBar' => true,
      'showWhenEmpty' => true,
      'playerPath' => self::getPlayerPath()
    );
  }

  /**
   * Returns the player parameters.
   */
  public static function getPlayerParams() {
    return array(
      'id' => 'player',
      'showPlaylist' => true,
      'file' => '',
      'flashPlayer' => 'minplayer/minplayer.swf',
      'image' => '',
      'volume' => 80,
      'autostart' => false,
      'autoLoad' => true,
      'streamer' => "",
      'apiKey' => "",
      'sessid' => "",
      'api' => 2,
      'drupalVersion' => 6,
      'links' => array(),
      'linksvertical' => false,
      'logo' => 'logo.png',
      'link' => "http://www.mediafront.org",
      'logopos' => 'sw',
      'logoWidth' => 49,
      'logoHeight' => 15,
      'logox' => 5,
      'logoy' => 5,
      'node' => "",
      'shuffle' => false,
      'loop' => false,
      'repeat' => false,
      'pageLimit' => 10,
      'protocol' => "auto",
      'server' => "drupal",
      'template' => "default",
      'baseURL' => "",
      'draggable' => false,
      'resizable' => false,
      'playlist' => "",
      'args' => array(),
      'wildcard' => "*",
      'gateway' => "",
      'vertical' => true,
      'scrollSpeed' => 15,
      'updateTimeout' => 20,
      'hysteresis' => 40,
      'dynamic' => false,
      'scrollMode' => "auto",
      'pageLink' => false,
      'debug' => false,
      'embedWidth' => 450,
      'embedHeight' => 337,
      'skin' => 'default',
      'autoNext' => true,
      'prefix' => '',
      'showScrollbar' => true,
      'controllerOnly' => false,
      'wmode' => 'transparent',
      'forceOverflow' => false,
      'volumeVertical' => false,
      'incrementTime' => 5,
      'quality' => 'default',
      'zIndex' => 400,
      'timeout' => 4,
      'fluidWidth' => false,
      'fluidHeight' => false,
      'fullscreen' => false
    );
  }

  /**
   * Set's the current session id for this player.
   */
  public function setSessionId( $sessid ) {
    $this->settings['sessid'] = $sessid;
  }

  /**
   * Get's the current template.
   */
  public function getTemplate() {
    return $this->settings['template'];
  }

  /**
   * Get's the current theme.
   */
  public function getTheme() {
    return $this->settings['theme'];
  }

  /**
   * Connect the playlist of this media player to another media player.
   *
   * Usage:
   *
   *    $playlist = new OSMPlayer(array(
   *       'width' => 150,
   *       'height' => 400,
   *       'playlistOnly' => true,
   *       'playlist' => 'http://www.mysite.com/playlist.xml'
   *    ));
   *
   *    $player = new OSMPlayer(array(
   *       'width' => 450,
   *       'height' => 400,
   *       'disablePlaylist' => true
   *    ));
   *
   *    $playlist->addPlaylistTo( $player );
   */
  public function addPlaylistTo( $player ) {
    $this->playlists[] = is_string($player) ? $player : $player->getId();
  }

  /**
   * Connect the controlbar of this media player to another media player.
   *
   * Usage:
   *
   *    $controller = new OSMPlayer(array(
   *       'width' => 400,
   *       'height' => 26,
   *       'controllerOnly' => true,
   *    ));
   *
   *    $player = new OSMPlayer(array(
   *       'playlist' => 'http://www.mysite.com/myplaylist.xml
   *    ));
   *
   *    $controller->addControllerTo( $player );
   */
  public function addControllerTo( $player ) {
    $this->controllers[] = is_string($player) ? $player : $player->getId();
  }

  /**
   * Returns the current id of the player.
   */
  public function getId() {
    return $this->settings['id'];
  }

  /**
   * Set the id for this media player.
   */
  public function setId( $newId ) {
    // Set the id of this player.
    $this->settings['id'] = $newId;
  }

  /**
   * Returns the current prefix of the player.
   */
  public function getPrefix() {
    return $this->settings['prefix'];
  }

  /**
   * Set the prefix for the CSS of this media player.
   */
  public function setPrefix( $newPrefix ) {
    // We only need to set the prefix if we generate the CSS.
    if( $this->template->settings['generateCSS'] ) {
      // Set the prefix.
      $this->settings['prefix'] = $newPrefix;

      // Set the template prefix.
      $this->template->setPrefix( $newPrefix );
    }
    else {
      $this->settings['prefix'] = '';
      $this->template->setPrefix( '' );
    }
  }

  /**
   * Get the JS header for this player.
   */
  public function getJSHeader() {
    $header = '';

    // Add all of the javascript files.
    $jsfiles = $this->getJSFiles();
    foreach( $jsfiles as $file ) {
      $header .= '<script type="text/javascript" src="' . $this->settings['playerPath'] . $file .'"></script>';
      $header .= "\n";
    }

    // Return the header.
    return $header;
  }

  /**
   * Get the header for this media player.
   */
  public function getHeader() {
    // Add the JS files to the header.
    $header = $this->getJSHeader();

    // Add the CSS files.
    $header .= $this->template->getCSSHeader();

    // Return the header.
    return $header;
  }

  /**
   * Get the javascript files for this media player.
   */
  public function getJSFiles() {
    $template = $this->settings['template'];
    if( $this->settings['debug'] ) {
      return array_merge( array(
        "js/source/jquery.media.drupal.js",
        "js/source/jquery.media.parser.js",
        "js/source/jquery.media.auto.js",
        "js/source/jquery.media.rpc.js",
        "js/source/jquery.media.json.js",
        "js/source/jquery.media.sha256.js",
        "js/source/jquery.media.utils.js",
        "js/source/jquery.media.control.js",
        "js/source/jquery.media.flash.js",
        "js/source/jquery.media.html5.js",
        "js/source/jquery.media.image.js",
        "js/source/jquery.media.link.js",
        "js/source/jquery.media.links.js",
        "js/source/jquery.media.display.js",
        "js/source/jquery.media.minplayer.js",
        "js/source/jquery.media.menu.js",
        "js/source/jquery.media.mousewheel.js",
        "js/source/jquery.media.node.js",
        "js/source/jquery.media.pager.js",
        "js/source/jquery.media.player.js",
        "js/source/jquery.media.playlist.js",
        "js/source/jquery.media.playlistlink.js",
        "js/source/jquery.media.rotator.js",
        "js/source/jquery.media.slider.js",
        "js/source/jquery.media.teaser.js",
        "js/source/jquery.media.titlebar.js",
        "js/source/jquery.media.scroll.js",
        "js/source/jquery.media.voter.js",
        "js/source/jquery.media.youtube.js",
        "js/source/jquery.media.vimeo.js",
        "js/source/jquery.media.dailymotion.js",
        "js/source/jquery.media.file.js"
      ), $this->template->settings['jsFiles']['debug'] );
    }
    else {
      return array_merge( array(
        "js/jquery.osmplayer.compressed.js",
      ), $this->template->settings['jsFiles']['release'] );
    }
  }

  /**
   * Converts a PHP variable into its Javascript equivalent.
   */
  public function osm_json_encode($var) {
    switch (gettype($var)) {
      case 'boolean':
        return $var ? 'true' : 'false'; // Lowercase necessary!
      case 'integer':
      case 'double':
        return $var;
      case 'resource':
      case 'string':
        return '"'. str_replace(array("\r", "\n", "<", ">", "&", "\'"),
          array('\r', '\n', '\x3c', '\x3e', '\x26', "'"),
          addslashes($var)) .'"';
      case 'array':
      // Arrays in JSON can't be associative. If the array is empty or if it
      // has sequential whole number keys starting with 0, it's not associative
      // so we can go ahead and convert it as an array.
        if (empty ($var) || array_keys($var) === range(0, sizeof($var) - 1)) {
          $output = array();
          foreach ($var as $v) {
            $output[] = $this->osm_json_encode($v);
          }
          return '['. implode(',', $output) .']';
        }
      // Otherwise, fall through to convert the array as an object.
      case 'object':
        $output = array();
        foreach ($var as $k => $v) {
          $output[] = $this->osm_json_encode(strval($k)) .': '. $this->osm_json_encode($v);
        }
        return '{'. implode(',', $output) .'}';
      default:
        return 'null';
    }
  }

  /**
   * Get the player parameters.  This will only return the parameters that are included in
   * the playerParams array.
   */
  public function getParams() {
    $params = array();
    foreach( $this->settings as $param => $value ) {
      if( array_key_exists( $param, $this->playerParams ) &&
        ($this->playerParams[$param] != $value) ) {
        switch( gettype($this->defaults[$param]) ) {
          case 'array':
          case 'object':
            $params[] = $param . ':' . $this->osm_json_encode($value);
            break;
          case 'string':
          // Make sure we are not dealing with a JSON string here.  If so, then don't include the quotes.
            $params[] = (substr($value, 0, 1) == '{') ? ($param . ':' . $value) : ($param . ':"' . str_replace( '"', "'", $value ) . '"');
            break;
          case 'boolean':
            $params[] = $param . ':' . ($value ? 'true' : 'false');
            break;
          default:
            $params[] = $param . ':' . ($value ? $value : 0);
            break;
        }
      }
    }

    $ids = array();

    // Iterate through all of our template Ids.
    foreach( $this->template->getIds() as $id => $value ) {

      // Only set this if it is different from the default.
      if( $this->template->defaultIds[$id] != $value ) {
        $ids[] = $id . ':"' . $value . '"';
      }
    }

    // If we have some id's different from the default, then add then to our params.
    if( count( $ids ) ) {
      // Now add all the Id's to the settings.
      $params[] = 'ids:{' . implode(',', $ids) . '}';
    }

    return $params;
  }

  /**
   * Returns the JavaScript code to add and instantiate the player on the page.
   */
  public function getJS() {
    // Return the script.
    return '<script type="text/javascript">' . $this->getPlayerJS() . '</script>';
  }

  /**
   * Returns the javascript to add the player to the page.
   */
  public function getPlayerJS() {
    $playerId = $this->getId();
    $params = $this->getParams();

    // Create the player in javascript.
    $js = 'var ' . $playerId . ' = jQuery("#' . $playerId . '").mediaplayer({' . implode(',', $params) . '});';

    // Now that the player has made it's way through the loading process... hide the busy cursor.
    $js .= 'jQuery("#'. $playerId .'_loading").hide();';

    // Now add our playlist connections to the javascript.
    foreach( $this->playlists as $playlist ) {
      $js .= 'jQuery.media.addPlaylist("' . $playlist . '",' . $playerId . ');';
    }

    // Now add our controller connections to the javascript.
    foreach( $this->controllers as $controller ) {
      $js .= 'jQuery.media.addController("' . $controller . '",' . $playerId . ');';
    }

    // Return the script.
    // We need to use setTimeout since some browsers jump the gun on when they are really ready.
    return 'jQuery(function() { setTimeout( function() {' . $js . '}, 10 ); });';
  }

  /**
   * The main API call for this player.  This will return the HTML and JavaScript for the
   * media player that you wish to add to your page.
   *
   * This function allows for dynamic theming of the player by passing parameters to the media
   * player ( i.e. playlistOnly, horizontal, etc ).
   */
  public function getPlayer() {
    $output = $this->getJS();
    $output .= "\n";

    // Determine the width and height of the player.
    $width = ($this->settings['playlistOnly'] && $this->settings['vertical']) ? '' : ('width:' . $this->settings['width'] . 'px;');
    $width = $this->settings['fluidWidth'] ? 'width:100%;' : $width;
    $height = (($this->settings['playlistOnly'] && !$this->settings['vertical']) || $this->settings['controllerOnly']) ? '' : ('height:' . $this->settings['height'] . 'px;');
    $height = $this->settings['fluidHeight'] ? 'height:100%;' : $height;

    // Set the version.
    $this->settings['version'] = $this->template->getVersion();

    // Get the output from the template.
    $output .= $this->template->theme( array(
        'params' => $this->settings,
        'width' => $width,
        'height' => $height
      )
    );

    return $output;
  }
}
?>