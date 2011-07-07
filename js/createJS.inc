<?php
// Include my functions...
include_once('myfunctions.inc');

function create_compressed_file( $output_dir, $original, $compressed ) {
   // Make sure they are different files...
   if( ($original != $compressed) ) {
      // Delete the previous compressed file.
      if( file_exists( $compressed ) ) {
         unlink( $compressed );
      }

      // Lint the file...
      print "\n\nCreating " . basename($compressed) . "\n";
      $command = 'jsl -process ' . $original;
      print shell_exec($command);
      $command = 'java -jar ' . $output_dir . 'js/yuicompressor/build/yuicompressor.jar --preserve-semi -o ' . $compressed . ' ' . $original;
      shell_exec( $command );
      addCopyRight( $output_dir, $compressed );
   }
}

function create_js_files( $output_dir, $files, $filter, $uncompressed, $compressed, $num_files, $source_dir = '' )
{
   if( $num_files > 1 ) {
      if( file_exists( $uncompressed ) ) {
         unlink( $uncompressed );
      }

      $handle = smart_fopen( $uncompressed, 'a+' );
      if( $handle ) {
         $index = 0;
         foreach( $files as $file ) {
            if( !$filter || in_array( basename($file), $filter ) ) {
               $contents = file_get_contents($file);
               if( $index != 0 ) {
                  $contents = str_replace('(function($) {', '', $contents);
                  $contents = str_replace('jQuery.media = jQuery.media ? jQuery.media : {};', '', $contents);
               }
               if( ++$index < $num_files ) {
                  $contents = str_replace('})(jQuery);', '', $contents);
               }
               fwrite( $handle, $contents );

               if( $source_dir ) {
                  create_compressed_file( $output_dir, $file, $source_dir . '/' . basename($file) );
               }
            }
         }
         fclose( $handle );
      }
   }

   create_compressed_file( $output_dir, $uncompressed, $compressed );
}

function addCopyRight( $output_dir, $file ) {
   static $copyright;
   if( !$copyright ) {
      $copyright = file_get_contents($output_dir . 'LICENSE.TXT');
   }
   $code = file_get_contents($file);
   unlink( $file );
   $handle = fopen( $file, 'a+' );
   if( $handle ) {
      fwrite( $handle, $copyright );
      fwrite( $handle, "\n" );
      fwrite( $handle, $code );
      fclose( $handle );
   }
}

function create_javascript_release( $output_dir = '' ) {
   define( "RELEASE_DIR", $output_dir . "js/source" );

   // Bad things will happen if the release directory is the same as the output.
   if( $output_dir != RELEASE_DIR ) {
      define( "RELEASE_SOURCE_DIR", $output_dir . "js/compressed");
      define( "MAX_RELEASE_FILE", $output_dir . "js/jquery.osmplayer.js");
      define( "MAX_RELEASE_FILE_COMPRESSED", $output_dir . "js/jquery.osmplayer.compressed.js" );
      define( "MIN_RELEASE_FILE", $output_dir . "js/jquery.minplayer.js" );
      define( "MIN_RELEASE_FILE_COMPRESSED", $output_dir . "js/jquery.minplayer.compressed.js" );
      define( "TEMPLATE_FILE", $output_dir . "templates/default/jquery.media.template.default.js" );
      define( "TEMPLATE_RELEASE_FILE", $output_dir . "templates/default/jquery.media.template.default.compressed.js" );

      $min_files = array(
         "jquery.media.minplayer.js",
         "jquery.media.control.js",
         "jquery.media.dailymotion.js",
         "jquery.media.display.js",
         "jquery.media.flash.js",
         "jquery.media.html5.js",
         "jquery.media.vimeo.js",
         "jquery.media.youtube.js"
      );

      // Make sure the src and template directory is created.
      if( !is_dir(RELEASE_SOURCE_DIR) ) {
      	mkdir(RELEASE_SOURCE_DIR, 0755, true);
     	}

      // Now create the compressed javascript files...
      $files = get_files(RELEASE_DIR, array("js"), false);
      $num_files = count($files);
      if( $num_files > 0 ) {
         create_js_files( $output_dir, $files, array(), MAX_RELEASE_FILE, MAX_RELEASE_FILE_COMPRESSED, $num_files, RELEASE_SOURCE_DIR );
         create_js_files( $output_dir, $files, $min_files, MIN_RELEASE_FILE, MIN_RELEASE_FILE_COMPRESSED, count($min_files) );
      }

      // Now create the template javascript file...
      create_compressed_file( $output_dir, TEMPLATE_FILE, TEMPLATE_RELEASE_FILE );
   }
}
?>