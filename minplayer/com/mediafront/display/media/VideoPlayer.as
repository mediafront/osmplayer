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

  import flash.media.Video;
  import flash.media.SoundTransform;
  import flash.media.SoundMixer;
  import flash.display.*;
  import flash.events.*;
  import flash.net.*;
  import flash.utils.*;

  public class VideoPlayer extends Video implements IMedia {
    public function VideoPlayer( _width:uint, _height:uint, _debug:Boolean, _onMediaEvent:Function ) {
      super(_width,_height);
      debug=_debug;
      onMediaEvent=_onMediaEvent;
    }

    public function connect( videoStream:String ):void {
      SoundMixer.stopAll();
      connection = new NetConnection();
      connection.objectEncoding=flash.net.ObjectEncoding.AMF0;
      connection.addEventListener(NetStatusEvent.NET_STATUS, statusHandler );
      connection.addEventListener(SecurityErrorEvent.SECURITY_ERROR,errorHandler);
      connection.addEventListener(IOErrorEvent.IO_ERROR,errorHandler);
      connection.addEventListener(AsyncErrorEvent.ASYNC_ERROR,errorHandler);
      connection.client=this;
      usingStream = (videoStream != null);
      connection.connect( (videoStream ? videoStream : null) );
    }

    private function setupVideoStream():void {
      stream=new NetStream(connection);
      stream.addEventListener(NetStatusEvent.NET_STATUS,statusHandler);
      stream.addEventListener(IOErrorEvent.IO_ERROR,errorHandler);
      stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, errorHandler);
      stream.bufferTime=5;
      stream.client=this;
      sound = new SoundTransform();
      stream.soundTransform=sound;
      super.attachNetStream(stream);
      smoothing=true;
      deblocking=3;
      onMediaEvent( MediaEvent.CONNECTED );
    }

    private function errorHandler(event:ErrorEvent):void {
      Utils.debug("Error: " + event.text);
    }

    public function loadFile( file:String ):void {
      totalTime=0;
      _videoWidth=0;
      _videoHeight=0;
      file=getFileName(file);

      if (usingStream) {
        connection.call( "getStreamLength", new Responder( streamlengthHandler ), file );
      }

      Utils.debug("video.loadFile( " + file + " )", debug);

      if (stream!=null) {
        try {
          SoundMixer.stopAll();
          stream.play(file);
        } catch (error:Error) {
          Utils.debug(error.toString());
          return;
        }
      }
      else {
        Utils.debug("loadFile ERROR: stream is not ready!", debug);
      }
    }

    public function seekMedia( pos:Number ):void {
      Utils.debug("video.seekMedia( " + pos + " )", debug);
      if (stream!=null) {
        try {
          stream.seek( pos );
        } catch (error:Error) {
          Utils.debug(error.toString());
          return;
        }
      }
      else {
        Utils.debug("seekMedia ERROR: stream is not ready!", debug);
      }
    }

    public function pauseMedia():void {
      if (stream!=null) {
        try {
          Utils.debug("stream.pause()", debug);
          stream.pause();
          onMediaEvent( MediaEvent.PAUSED );
        } catch (error:Error) {
          Utils.debug(error.toString());
          return;
        }
      }
      else {
        Utils.debug("pauseMedia ERROR: stream is not ready!", debug);
      }
    }

    public function playMedia( setPos:Number = -1 ):void {
      if (stream!=null) {
        try {
          Utils.debug("stream.resume()", debug);
          stream.resume();
          onMediaEvent( MediaEvent.PLAYING );
        } catch (error:Error) {
          Utils.debug(error.toString());
          return;
        }
      }
      else {
        Utils.debug("playMedia ERROR: stream is not ready!", debug);
      }
    }

    public function stopMedia():void {
      Utils.debug("video.stopMedia()", debug);
      SoundMixer.stopAll();
      if (stream) {
        stream.removeEventListener(NetStatusEvent.NET_STATUS,statusHandler);
        stream.removeEventListener(IOErrorEvent.IO_ERROR,errorHandler);
        stream.removeEventListener(AsyncErrorEvent.ASYNC_ERROR, errorHandler);
        stream.close();
      }

      if (connection) {
        connection.removeEventListener(NetStatusEvent.NET_STATUS, statusHandler );
        connection.removeEventListener(SecurityErrorEvent.SECURITY_ERROR,errorHandler);
        connection.removeEventListener(IOErrorEvent.IO_ERROR,errorHandler);
        connection.removeEventListener(AsyncErrorEvent.ASYNC_ERROR,errorHandler);
        connection.close();
      }
      onMediaEvent( MediaEvent.STOPPED );
    }

    public function getVolume():Number {
      if (sound) {
        return sound.volume;
      }
      return 0;
    }

    public function setVolume(vol:Number):void {
      if (sound && stream) {
        sound.volume=vol;
        stream.soundTransform=sound;
      }
      else {
        Utils.debug("setVolume ERROR: stream is not ready!", debug);
      }
    }

    public function onMetaData(info:Object):void {
      Utils.debug("onMetaData: totalTime=" + info.duration + ", width=" + info.width + ", height=" + info.height, debug );
      totalTime=info.duration;
      _videoWidth=info.width;
      _videoHeight=info.height;
      onMediaEvent( MediaEvent.META );
    }

    public function onPlayStatus(info:Object):void {
      Utils.debug("onPlayStatus( " + info.code + " )", debug );
      if (info.code=="NetStream.Play.Complete") {
        onMediaEvent( MediaEvent.COMPLETE );
      }
    }

    public function onLastSecond(info:Object):void {
      Utils.debug("onLastSecond( " + info.code + " )", debug );
    }

    public function onCuePoint(info:Object):void {
      Utils.debug("onCuePoint( " + info.code + " )", debug );
    }

    public function onXMPData(info:Object):void {
    }
    public function onTextData(info:Object):void {
    }
    public function onCaptionInfo(info:Object):void {
    }
    public function onCaption(cps:String,spk:Number):void {
    }
    public function onBWDone(...args):void {
    }

    private function getFileName( fileName:String ):String {
      if (usingStream) {
        var ext:String=Utils.getFileExtension(fileName);
        if (ext=='mp3') {
          return 'mp3:'+fileName.substr(0,fileName.length-4);
        } else if (ext == 'mp4' || ext == 'mov' || ext == 'aac' || ext == 'm4a') {
          return 'mp4:'+fileName;
        } else if (ext == 'flv') {
          return fileName.substr(0,fileName.length-4);
        }
      }
      return fileName;
    }

    private function streamlengthHandler(len:Number):void {
      totalTime=len;
      onMediaEvent( MediaEvent.META );
    }

    public function getDuration():Number {
      return totalTime;
    }

    public function getCurrentTime():Number {
      return (stream != null) ? stream.time : 0;
    }

    public function getMediaBytesLoaded():Number {
      return stream ? stream.bytesLoaded : 0;
    }

    public function getMediaBytesTotal():Number {
      return stream ? stream.bytesTotal : 0;
    }

    private function statusHandler(event:NetStatusEvent):void {
      Utils.debug("Video: status = " + event.info.code, debug );
      switch ( event.info.code ) {
        case "NetConnection.Connect.Success" :
          setupVideoStream();
          break;

        case "NetStream.Buffer.Empty" :
          onMediaEvent( MediaEvent.BUFFERING );
          break;

        case "NetStream.Pause.Notify" :
          onMediaEvent( MediaEvent.PAUSED );
          break;

        case "NetStream.Buffer.Full" :
          onMediaEvent( MediaEvent.PLAYING );
          break;

        case "NetStream.Play.Start" :
          if (usingStream) {
            onMediaEvent( MediaEvent.BUFFERING );
          }
          break;

        case "NetStream.Play.Stop" :
          if (! usingStream) {
            onMediaEvent( MediaEvent.COMPLETE );
          }
          break;

        case "NetStream.Play.StreamNotFound" :
          stopMedia();
          break;

        default :
          break;
      }
    }

    public function setSize( newWidth:Number, newHeight:Number ):void {
      this.width=newWidth;
      this.height=newHeight;
    }

    public function getRatio():Number {
      return (videoHeight) ? (videoWidth / videoHeight) : (_videoWidth / _videoHeight);
    }

    private var connection:NetConnection=null;
    private var stream:NetStream=null;
    private var sound:SoundTransform;
    private var totalTime:Number=0;
    private var usingStream:Boolean=false;
    private var debug:Boolean=false;
    private var _videoWidth:Number=0;
    private var _videoHeight:Number=0;
    private var onMediaEvent:Function=null;
  }
}