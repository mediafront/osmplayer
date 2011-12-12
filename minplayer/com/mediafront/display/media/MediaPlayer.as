/**
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
package com.mediafront.display.media {
  import com.mediafront.plugin.SkinablePlugin;
  import com.mediafront.display.Image;
  import com.mediafront.display.media.MediaEvent;
  import com.mediafront.display.media.MediaFile;
  import com.mediafront.display.media.VideoPlayer;
  import com.mediafront.display.media.AudioPlayer;
  import com.mediafront.plugin.PluginEvent;
  import com.mediafront.utils.Settings;
  import com.mediafront.utils.MediaSettings;
  import com.mediafront.utils.Utils;

  import flash.display.*;
  import flash.external.ExternalInterface;
  import flash.geom.Rectangle;
  import flash.events.*;
  import flash.system.Security;

  public class MediaPlayer extends SkinablePlugin {
    public function MediaPlayer() {
      super();
      addCallbacks();
    }

    public override function loadSettings( _settings:Object ):void {
      super.loadSettings( new MediaSettings( _settings ) );
      super.loadSkin( settings.mediaPlayer );
    }

    public override function setSkin( _skin:MovieClip ):void {
      mediaRegion=_skin.mediaRegion;
      backgroundMC=_skin.backgroundMC;
      if (_skin.preview&&settings.image) {
        preview=_skin.preview;
        preview.addEventListener(Event.ADDED, onPreviewLoaded);
        preview.loadImage( settings.image );
      }

      super.setSkin( _skin );
    }

    protected function onPreviewLoaded( event:Event ) {
      preview.resize( backgroundMC.getRect(this) );
    }

    public override function onReady():void {
      super.onReady();

      // Don't load the media until all plugins have finished loading.
      loadMedia( settings.file, settings.stream );
    }

    private function addCallbacks():void {
      if (ExternalInterface.available) {
        try {
          ExternalInterface.addCallback( "loadMedia", loadMedia );
          ExternalInterface.addCallback( "playMedia", playMedia );
          ExternalInterface.addCallback( "pauseMedia", pauseMedia );
          ExternalInterface.addCallback( "stopMedia", stopMedia );
          ExternalInterface.addCallback( "seekMedia", seekMedia );
          ExternalInterface.addCallback( "setVolume", setVolume );
          ExternalInterface.addCallback( "getVolume", getVolume );
          ExternalInterface.addCallback( "getCurrentTime", getCurrentTime );
          ExternalInterface.addCallback( "getDuration", getDuration );
          ExternalInterface.addCallback( "getMediaBytesLoaded", getMediaBytesLoaded );
          ExternalInterface.addCallback( "getMediaBytesTotal", getMediaBytesTotal );
        } catch (error:SecurityError) {
          Utils.debug("A SecurityError occurred: " + error.message + "\n");
        } catch (error:Error) {
          Utils.debug("An Error occurred: " + error.message + "\n");
        }
      }
    }

    public function loadMedia( filePath:String, _stream:String = "" ):void {
      createMedia( new MediaFile( {path:filePath, stream:_stream} ) );
    }

    public function playMedia():void {
      try {
        if (media && loadedFile.loaded) {
          media.playMedia();
        }
      } catch (e:Error) {
        Utils.debug( "ERROR: playMedia: " + e.toString() );
      }
    }
    public function pauseMedia():void {
      try {
        if (media && loadedFile.loaded) {
          media.pauseMedia();
        }
      } catch (e:Error) {
        Utils.debug( "ERROR: pauseMedia: " + e.toString() );
      }
    }
    public function seekMedia( pos:Number ):void {
      try {
        if (media && loadedFile.loaded) {
          media.seekMedia( pos );
        }
      } catch (e:Error) {
        Utils.debug( "ERROR: seekMedia: " + e.toString() );
      }
    }
    public function setVolume( vol:Number ):void {
      try {
        if (media) {
          media.setVolume( vol );
        }
      } catch (e:Error) {
        Utils.debug( "ERROR: setVolume: " + e.toString() );
      }
    }
    public function getVolume():Number {
      return media ? media.getVolume() : 1;
    }
    public function getCurrentTime():Number {
      return media ? media.getCurrentTime() : 0;
    }
    public function getDuration():Number {
      return media ? media.getDuration() : 0;
    }
    public function getMediaBytesLoaded():Number {
      return media ? media.getMediaBytesLoaded() : 0;
    }
    public function getMediaBytesTotal():Number {
      return media ? media.getMediaBytesTotal() : 0;
    }

    public override function onResize( deltaX:Number, deltaY:Number ):void {
      // Resize the skin.
      super.onResize( deltaX, deltaY );

      // Now resize the video.
      var mediaRatio:Number=media?media.getRatio():0;
      if (mediaRatio) {
        var videoRect:Rectangle=Utils.getScaledRect(mediaRatio,backgroundMC.getRect(this));
        media.setSize( videoRect.width, videoRect.height );
        media.x=videoRect.x;
        media.y=videoRect.y;
      }
    }

    public function onMediaEvent( type:String ):void {
      var dispatch:Boolean=true;

      if (ExternalInterface.available&&settings) {
        Utils.debug("Calling Flash Update: " + type, settings.debug );
        ExternalInterface.call( "onFlashPlayerUpdate", settings.id, type );
      }

      switch ( type ) {
        case MediaEvent.CONNECTED :
          onMediaConnected();
          break;
        case MediaEvent.PLAYING :
          dispatch=onMediaPlaying();
          break;
        case MediaEvent.META :
          onMediaMeta();
          break;
      }

      if (dispatch) {
        // Now dispatch this event for everyone interested.
        dispatchEvent( new MediaEvent( type ) );
      }
    }

    private function onMediaConnected():void {
      media.loadFile( loadedFile.path );
    }

    private function onMediaPlaying():Boolean {
      loadedFile.loaded=true;
      if (settings && !settings.autostart) {
        settings.autostart=true;
        if (preview && mediaRegion) {
          mediaRegion.visible=false;
        }
        pauseMedia();
        return false;
      } else {
        // Set the preview to be invisible for non-audio types.
        if (preview) {
          preview.visible = (loadedFile.mediaType == "audio");
        }

        // Reshow the media region.
        if (preview && mediaRegion) {
          mediaRegion.visible=true;
        }
      }
      return true;
    }

    private function onMediaMeta():void {
      loadedFile.loaded=true;
      onResize(0,0);
    }

    private function createMedia( mediaFile:MediaFile ):void {
      if (mediaFile.isValid()) {
        stopMedia();

        // Make sure our preview is visible.
        if (preview) {
          preview.visible=true;
        }

        // Only load a new player if we must.
        if ( !loadedFile || (loadedFile.mediaType != mediaFile.mediaType) ) {
          switch ( mediaFile.mediaType ) {
            case "video" :
              addVideo( new VideoPlayer( stage.stageWidth, stage.stageHeight, settings.debug, onMediaEvent) );
              break;

            case "swf" :
              addVideo( new SWFPlayer(settings.debug, onMediaEvent) );
              break;

            case "audio" :
              media=new AudioPlayer(settings.debug,onMediaEvent);
              break;
          }
        }

        if (media) {
          try {
            media.addEventListener( MediaEvent.CONNECTED, onMediaEvent );
            media.addEventListener( MediaEvent.META, onMediaEvent );
            media.addEventListener( MediaEvent.BUFFERING, onMediaEvent );
            media.addEventListener( MediaEvent.PAUSED, onMediaEvent );
            media.addEventListener( MediaEvent.PLAYING, onMediaEvent );
            media.addEventListener( MediaEvent.COMPLETE, onMediaEvent );
          } catch (error:Error) {
            Utils.debug("An Error occurred: " + error.message + "\n");
          }
        }

        // Save the loaded file for later.
        loadedFile=mediaFile;

        // Connect to the media stream.
        media.connect( mediaFile.stream );
      }
    }

    public function stopMedia():void {
      if (media) {
        media.stopMedia();
        try {
          media.removeEventListener( MediaEvent.CONNECTED, onMediaEvent );
          media.removeEventListener( MediaEvent.META, onMediaEvent );
          media.removeEventListener( MediaEvent.BUFFERING, onMediaEvent );
          media.removeEventListener( MediaEvent.PAUSED, onMediaEvent );
          media.removeEventListener( MediaEvent.PLAYING, onMediaEvent );
          media.removeEventListener( MediaEvent.COMPLETE, onMediaEvent );
        } catch (error:Error) {
          Utils.debug("An Error occurred: " + error.message + "\n");
        }
      }
    }

    private function addVideo( _media:* ):void {
      if (media) {
        mediaRegion.removeChild( media );
      }
      media=_media;
      mediaRegion.addChild( media );
    }

    public var mediaRegion:MovieClip;
    public var backgroundMC:MovieClip;
    public var preview:Image;
    public var media:* =null;
    public var loadedFile:MediaFile=null;
  }
}