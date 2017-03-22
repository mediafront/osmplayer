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
class OSMPlayer
{  
   // The complete settings of the media player.
   private $settings;
   
   // The base path where this script is loaded.
   private $base_path = '';
   
   // The base url where this script is loaded.
   private $base_url = '';
   
   // The prefix for the media player to keep html/css collisions from occuring.
   private $prefix = 'player';
   
   // The playlists connected to this media player.
   private $playlists = array();
   
   // The controllers connected to this media player.
   private $controllers = array();  
   
   // The version of this player.
   private $version = '';
   
   // The CSS directory to store the cached templates in.
   private $css_dir = '';
   
   // All the configurable id's for the elements within this player.
   private $ids = array(
      'loading' => '.mediaplayerloading',
      'player' => '.mediaplayer',
      'menu' => '.mediamenu',
      'titleBar' => '.mediatitlebar',
      'node' => '.medianode',
      'playlist' => '.mediaplaylist',
      'currentTime' => '.mediacurrenttime',
      'totalTime' => '.mediatotaltime',
      'playPause' => '.mediaplaypause',
      'seekUpdate' => '.mediaseekupdate',
      'seekProgress' => '.mediaseekprogress',
      'seekBar' => '.mediaseekbar',
      'seekHandle' => '.mediaseekhandle',
      'volumeUpdate' => '.mediavolumeupdate',
      'volumeBar' => '.mediavolumebar',
      'volumeHandle' => '.mediavolumehandle',
      'mute' => '.mediamute',
      'linkText' => '.medialinktext',   
      'linkScroll' => '.medialinkscroll',
      'close' => '#mediamenuclose',
      'embed' => '#mediaembed',
      'elink' => '#mediaelink',
      'email' => '#mediaemail',
      'busy' => '.mediabusy',
      'preview' => '.mediapreview',
      'play' => '.mediaplay',
      'media' => '.mediadisplay',
      'control' => '.mediacontrol',
      'voter' => '.mediavoter',
      'uservoter' => '.mediauservoter',
      'mediaRegion' => '.mediaregion',
      'field' => '.mediafield',
      'prev' => '.mediaprev',
      'next' => '.medianext',
      'loadPrev' => '.medialoadprev',
      'loadNext' => '.medialoadnext',
      'prevPage' => '.mediaprevpage',
      'nextPage' => '.medianextpage',
      'pager' => '.mediapager',
      'scroll' => '.mediascroll',
      'busy' => '.mediabusy',
      'links' => '.medialinks',
      'listMask' => '.medialistmask',
      'list' => '.medialist',
      'scrollWrapper' => '.mediascrollbarwrapper',
      'scrollBar' => '.mediascrollbar',
      'scrollTrack' => '.mediascrolltrack',
      'scrollHandle' => '.mediascrollhandle',
      'scrollUp' => '.mediascrollup',
      'scrollDown' => '.mediascrolldown',
      'titleLinks' => '.mediatitlelinks'                                           
   );

   // All of the player specific parameters that can be changed.
   private $playerParams = array( 
      'id' => 'player',
      'showPlaylist' => true,   
      'file' => '',
      'flashplayer' => 'flash/mediafront.swf',
      'image' => '',    
      'volume' => 80, 
      'autostart' => false, 
      'autoLoad' => true,
      'streamer' => "", 
      'apiKey' => "",
      'sessid' => "", 
      'api' => 2, 
      'version' => 6,
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
      'showScrollbar' => true
   );

   // All of the settings that can be used to control the function of the player (not passed to the js player).
   private $playerSettings = array(
      'width' => OSMPLAYER_DEFAULT_WIDTH,
      'height' => OSMPLAYER_DEFAULT_HEIGHT,
      'theme' => 'dark-hive',
      'version' => '0.01',
      'showController' => true,
      'disablePlaylist' => false,
      'playlistOnly' => false,
      'controllerOnly' => false,
      'showNodeVoter' => true,
      'showTeaserVoter' => true,
      'showTitleBar' => true
   );

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
   public function OSMPlayer( $_params = array() )
   {   
      // First set the defaults.
      $this->settings = array_merge( $this->playerParams, $this->playerSettings );
      
      if( $_params ) {   
         // Set the parameters ( which will override the defaults ).
         $this->settings = array_merge( $this->settings, $_params ); 
      }
      
      // Make sure we set the ID.
      $this->setId( $this->settings['id'] );
      
      // Set the base path and url of this class.
      $base_root = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http';
      $base_url = $base_root .= '://'. $_SERVER['HTTP_HOST'];
      if ($dir = trim(dirname($_SERVER['SCRIPT_NAME']), '\,/')) {
         $base_url .= "/$dir";
      }
      
      $this->base_path = trim( str_replace( realpath('.'), '', dirname(__FILE__)), '/' );
      $this->base_url = $base_url . '/' . $this->base_path;
      $this->settings['playerurl'] = $this->base_url;
      
      // Set the correct flash player and logo url path.
      $this->settings['flashplayer'] = isset($_params['flashplayer']) ? $_params['flashplayer'] : ($this->base_url . '/flash/mediafront.swf');
      $this->settings['logo'] = isset($_params['logo']) ? $_params['logo'] : ($this->base_url . '/logo.png');
   }   
   
   /**
    * Returns the current id of the player.
    */
   public function getId()
   {
      return $this->settings['id'];  
   }
   
   /**
    * Returns the player settings.
    */
   public function getPlayerSettings()
   {
      return $this->playerSettings;  
   }

   /**
    * Set the CSS directory for this media player.
    */
   public function setCSSDirectory( $dir ) {
   	$this->css_dir = $dir;
   }
   
   /**
    * Returns the player parameters.
    */
   public function getPlayerParams()
   {
      $params = $this->playerParams;  
      $params['flashplayer'] = $this->base_url . '/' . $params['flashplayer'];
      $params['logo'] = $this->base_url . '/' . $params['logo'];
      return $params;
   }

   /**
    * Set's the current session id for this player.
    */
   public function setSessionId( $sessid ) 
   {
      $this->settings['sessid'] = $sessid;
   }

   /**
    * Get's the current template.
    */
   public function getTemplate()
   {
      return $this->settings['template'];
   }
   
   /**
    * Get's the current theme.
    */   
   public function getTheme()
   {
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
   public function addPlaylistTo( $player )
   {
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
   public function addControllerTo( $player )
   {
      $this->controllers[] = is_string($player) ? $player : $player->getId();
   }

   /**
    * Returns the CSS file that is located within the current theme.
    */   
   public function getThemeCSS()
   {
      $theme_folder = 'jquery-ui/css/' . $this->settings['theme'];
      $theme_css = '';
      
      // Now search this folder for the CSS file...
      if($contents = opendir( dirname(__FILE__) . '/' . $theme_folder)) {
         while(($node = readdir($contents)) !== false) {
            if( preg_match('/\.css$/', $node) ) {
               $theme_css = $node;
               break;
            }
         }
      }
      
      // Add the theme.
      if( $theme_css ) {
         return ($theme_folder . '/' . $theme_css);
      }
      else {
         return '';
      }   
   }

   /**
    * Writes the contents of one CSS file to another, but also replaces all the id's and
    * class names to take into account the prefix ( id ) of the media player.
    */   
   private function writeCSS( $css, $handle )
   {
      // Get the file contents and length.
      $contents = file_get_contents( dirname(__FILE__) . '/' . $css);
      
      // Change all of the images to the correct path...
      $contents = str_replace( 'images/', $this->base_url . '/' . str_replace( basename($css), '', $css ) . 'images/', $contents );
      
      // Get the length of the contents.
      $len = strlen( $contents );
      
      // Make sure we don't overwrite anything within brackets...
      $match = 0;
      $matches = array();
      preg_match_all('/\{.*\}/sU', $contents, $matches, PREG_OFFSET_CAPTURE);
   
      $match_len = strlen( $matches[0][$match][0] );
      
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
            fwrite( $handle, $char . $this->settings['id'] . '_' );
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
   public function createCSS()
   {     
      // Store the CSS directory for later usage.
      $dir = $this->css_dir ? $this->css_dir : dirname(__FILE__) . '/css';
   	
      // Make sure this directory exists.
      if( !is_dir( $dir ) ) {
         // Create the directory.
         mkdir( $dir, 0775, true );
      }
   	
      // Now make sure the directory has the right permissions.
      chmod( $dir, 0775 );
   	
      // Store the template and theme names.
      $template = $this->settings['template'];
      $to_path = $dir . '/' . $this->settings['id'];
      $from_path = 'templates/' . $template . '/osmplayer_' . $template;

      // Setup the files array.
      $files = array(
         ($to_path . '.css') => array(
            $from_path . '.css',
            $this->getThemeCSS()
         ),
         ($to_path . '_ie.css') => array(
            $from_path . '_ie.css'
         )         
      );
      
      // Iterate through all of our css files we need to create.
      foreach( $files as $file => $contents ) {
         // Now open up the new css file.
         $handle = fopen( $file, 'a+' );
         if( $handle ) {
            // Iterate through all the files that will be combined to
            // create this css file.
            foreach( $contents as $content ) {
               // Write to the css file.
               $this->writeCSS( $content, $handle );
            }
            
            // Close the file.
            fclose( $handle );
         }  

         // Now set the file permissions to 775.
         chmod( $file, 0775 );
      }   
   }

   /**
    * Delete the current cached CSS files.
    */   
   public function deleteCSS()
   {
      $css_path = dirname(__FILE__) . '/css/' . $this->settings['id'];
      $css = $css_path . '.css';
      if( is_file( $css ) ) {
         unlink( $css ); 
      }

      $css = $css_path . '_ie.css';    
      if( is_file( $css ) ) {
         unlink( $css );   
      }     
   }

   /**
    * Get an array of the CSS files for this player.
    */   
   public function getCSSFiles()
   {
      // Cache the prefix name.
      $id = $this->settings['id'];
      
      // The CSS files for this id.
      $files = array(
         "css/{$id}.css",
         "css/{$id}_ie.css"      
      );
      
      // If the CSS files do not exist, then create them.
      if( !is_file( dirname(__FILE__) . $files[0] ) ) {
         $this->createCSS();
      }
      
      // Return the CSS files.
      return $files;
   }

   /**
    * Set the id for this media player.
    */   
   public function setId( $newId )
   {     
      // The id and the prefix are the same thing.
      $this->settings['id'] = $newId;
      $this->settings['prefix'] = $newId . '_';
      
      // Iterate through all the id's and add the id.  
      foreach( $this->ids as $index => $id ) {
         $this->ids[$index] = $id[0] . $this->settings['prefix'] . substr( $id, 1 );          
      }    
   }

   /**
    * Get's the player version number.
    */
   public function getVersion()
   {
      $this->version = $this->version ? $this->version : file_get_contents( dirname(__FILE__) . '/version' );
      return $this->version;
   }

   /**
    * Get the CSS header for this player.
    */
   public function getCSSHeader()
   {
      $base_path = $this->base_path ? $this->base_path . '/' : '';   	
   	
      // Add the CSS files.
      $css_files = $this->getCSSFiles();
      $header = '<link rel="stylesheet" type="text/css" href="' . $base_path . $css_files[0] . '" />';
      $header .= "\n";
      $header .= '<!--[if IE]><link rel="stylesheet" type="text/css" href="' . $base_path . $css_files[1] . '" /><![endif]-->';
      $header .= "\n";
      
      // Return the header.
      return $header;   	
   }
   
   /**
    * Get the header for this media player.
    */   
   public function getHeader()
   {
      $header = '';
      $template = $this->settings['template'];
      $base_path = $this->base_path ? $this->base_path . '/' : '';
      
      // Add all of the javascript files.
      $jsfiles = $this->getJSFiles();
      foreach( $jsfiles as $file ) {
         $header .= '<script type="text/javascript" src="' . $base_path . $file .'"></script>';
         $header .= "\n";
      }
      
      // Add the CSS files.
      $header .= $this->getCSSHeader();
      
      // Return the header.
      return $header;
   }

   /**
    * Get the javascript files for this media player.
    */      
   public function getJSFiles()
   {
      $template = $this->settings['template'];   
      if( $this->settings['debug'] ) {
         return array(                               
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
            "js/source/jquery.media.node.js",                                     
            "js/source/jquery.media.pager.js",                                    
            "js/source/jquery.media.player.js",                                   
            "js/source/jquery.media.playlist.js",                                 
            "js/source/jquery.media.playlistlink.js",                             
            "js/source/jquery.media.slider.js",                                   
            "js/source/jquery.media.teaser.js",                                   
            "js/source/jquery.media.titlebar.js",                                 
            "js/source/jquery.media.scroll.js",                                   
            "js/source/jquery.media.voter.js",                                    
            "js/source/jquery.media.youtube.js",                                  
            "js/source/jquery.media.vimeo.js",                                    
            "js/source/jquery.media.dailymotion.js",                            
            "templates/{$template}/jquery.media.template.{$template}.js"
         );      
      }
      else {
         return array(
            "js/jquery.osmplayer.compressed.js",
            "templates/{$template}/jquery.media.template.{$template}.compressed.js"
         );   
      }
   }

   /**
    * Get the player parameters.  This will only return the parameters that are included in
    * the playerParams array.
    */   
   public function getParams() 
   {
      $params = array();     
      foreach( $this->settings as $param => $value ) {
         if( array_key_exists( $param, $this->playerParams ) && 
             ($this->playerParams[$param] != $value) ) {
            switch( gettype($value) ) {
               case 'array':
               case 'object':
                  $params[] = $param . ':' . json_encode($value); 
                  break;
               case 'string':
                  // Make sure we are not dealing with a JSON string here.  If so, then don't include the quotes.
                  $params[] = (substr($value, 0, 1) == '{') ? ($param . ':' . $value) : ($param . ':"' . str_replace( '"', "'", $value ) . '"');
                  break;
               case 'boolean':
                  $params[] = $param . ':' . ($value ? 'true' : 'false');
                  break;
               default:
                  $params[] = $param . ':' . $value;
                  break;
            }
         }   
      }
      
      $ids = array();
      foreach( $this->ids as $id => $value ) {
         $ids[] = $id . ':"' . $value . '"';
      }
      // Now add all the Id's to the settings.
      $params[] = 'ids:{' . implode(',', $ids) . '}';      
      return $params;      
   }

   /**
    * Returns the JavaScript code to add and instantiate the player on the page.
    */
   public function getJS()
   {    
      // Return the script.
      return '<script type="text/javascript">' . $this->getPlayerJS() . '</script>';   
   }

   /**
    * Returns the javascript to add the player to the page.
    */   
   public function getPlayerJS()
   {
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
      return 'jQuery(document).ready(function() {' . $js . '});';   
   }

   /**
    * A theme preprocess function for the main player.
    */   
   public function theme_preprocess( &$variables )
   {   
      $variables['titlebar'] = $this->theme( $variables,  '_titlebar' );  
      $variables['menu'] = $this->theme( $variables,  '_menu' );     
      $variables['node'] = $this->theme( $variables,  '_node' );
      $variables['playlist'] = $this->theme( $variables,  '_playlist' );      
   }

   /**
    * A theme preprocess function for the node.
    */
   public function theme_preprocess_node( &$variables )
   {   
      $variables['controlBar'] = $this->theme( $variables,  '_controlbar' );  
   }

   /**
    * A theme preprocess function for the menu.
    */
   public function theme_preprocess_menu( &$variables )
   {   
      $variables['version'] = $this->getVersion();  
   }

   /**
    * A theme preprocess function for the control bar.
    */
   public function theme_preprocess_controlbar( &$variables )
   {   
      $variables['voter'] = $this->theme( $variables,  '_nodevoter' );
   }

   /**
    * A theme preprocess function for the teaser.
    */   
   public function theme_preprocess_teaser( &$variables )
   {   
      $variables['teaservoter'] = $this->theme( $variables,  '_teaservoter' ); 
   }

   /**
    * A theme preprocess function for the playlist.
    */   
   public function theme_preprocess_playlist( &$variables )
   {   
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

   /**
    * This is the core theme function for the media player.  It allows for recursive themes to be
    * declared where a preprocessor for each theme can be employed using a theme_preprocess_{$subtemplate} name.
    */   
   public function theme( $variables, $subtemplate = '' )
   {
      $template = $variables['params']['template'];
      $preprocess = 'theme_preprocess' . $subtemplate;
      if( method_exists( $this, $preprocess ) ) {
         $this->{$preprocess}( $variables );   
      }
      extract($variables, EXTR_SKIP);  // Extract the variables to a local namespace
      ob_start();                      // Start output buffering
      include "templates/{$template}/osmplayer_{$template}{$subtemplate}.tpl.php";               
      $contents = ob_get_contents();   // Get the contents of the buffer
      ob_end_clean();                  // End buffering and discard
      return $contents;                // Return the contents      
   }

   /**
    * The main API call for this player.  This will return the HTML and JavaScript for the
    * media player that you wish to add to your page.
    * 
    * This function allows for dynamic theming of the player by passing parameters to the media
    * player ( i.e. playlistOnly, horizontal, etc ).
    */   
   public function getPlayer()
   {
      $output = $this->getJS();
      $output .= "\n";
      $output .= $this->theme( array('params' => $this->settings) );  
      return $output;      
   }   
}
?>