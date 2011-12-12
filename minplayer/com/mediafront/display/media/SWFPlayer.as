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
  import com.mediafront.utils.Utils;
  import com.mediafront.display.media.MediaEvent;
  import com.mediafront.display.media.IMedia;

  import flash.display.*;
  import flash.events.*;
  import flash.media.*;
  import flash.utils.*;
  import flash.net.*;

  public class SWFPlayer extends MovieClip implements IMedia {
    public function SWFPlayer( _debug:Boolean, _onMediaEvent:Function ) {
      loader=null;
      bytesLoaded=0;
      bytesTotal=0;
      as2=false;
      debug=_debug;
      onMediaEvent=_onMediaEvent;
    }

    public function connect( stream:String ):void {
      onMediaEvent( MediaEvent.CONNECTED );
    }

    public function loadFile( file:String ):void {
      Utils.debug("swf.loadFile( " + file + " )", debug);
      bytesLoaded=0;
      bytesTotal=0;
      if (swf) {
        removeChild(swf);
      }
      loader = new Loader();
      loader.contentLoaderInfo.addEventListener( Event.COMPLETE, onLoaded );
      loader.contentLoaderInfo.addEventListener( ProgressEvent.PROGRESS, onLoading );
      loader.contentLoaderInfo.addEventListener( IOErrorEvent.IO_ERROR, onError );
      loader.load(new URLRequest(file));
    }

    private function onLoaded( event:Event ):void {
      try {
        swf=MovieClip(loader.content);
      } catch (error:Error) {
        swf=AVM1Movie(loader.content);
        as2=true;
      }
      addChild(swf);
      onMediaEvent( MediaEvent.META );
      onMediaEvent( MediaEvent.PLAYING );
    }

    private function onLoading( event:ProgressEvent ):void {
      bytesLoaded=event.bytesLoaded;
      bytesTotal=event.bytesTotal;
    }

    private function onError(event:Event):void {
    }

    public function getVolume():Number {
      return 0;
    }

    public function setVolume(vol:Number):void {
    }

    public function playMedia( setPos:Number = -1 ):void {
      Utils.debug("swf.playMedia()", debug);
      if (! as2) {
        swf.play();
        onMediaEvent( MediaEvent.PLAYING );
      }
    }

    public function pauseMedia():void {
      Utils.debug("swf.pauseMedia()", debug);
      if (! as2) {
        swf.stop();
        onMediaEvent( MediaEvent.PAUSED );
      }
    }

    public function stopMedia():void {
      Utils.debug("swf.stopMedia()", debug);
      if (! as2) {
        swf.stop();
      }
      loader.unload();
      onMediaEvent( MediaEvent.STOPPED );
    }

    public function seekMedia( pos:Number ):void {
      if (! as2&&swf&&stage) {
        swf.gotoAndPlay( (pos / stage.frameRate) );
      }
    }

    public function getDuration():Number {
      if (! as2&&swf&&stage) {
        return (swf.totalFrames / stage.frameRate);
      } else {
        return 0;
      }
    }

    public function getCurrentTime():Number {
      if (! as2&&swf&&stage) {
        return (swf.currentFrame / stage.frameRate);
      } else {
        return 0;
      }
    }

    public function setSize( _width:Number, _height:Number ):void {
      swf.width=_width;
      swf.height=_height;
    }

    public function getRatio():Number {
      return (swf.width / swf.height);
    }

    public function getMediaBytesLoaded():Number {
      return bytesLoaded;
    }

    public function getMediaBytesTotal():Number {
      return bytesTotal;
    }

    public var bytesLoaded:Number;
    public var bytesTotal:Number;
    private var loader:Loader;
    private var swf:*;
    private var as2:Boolean=false;
    private var debug:Boolean;
    private var onMediaEvent:Function=null;
  }
}