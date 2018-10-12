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
  import flash.events.*;

  public class MediaEvent extends Event {
    public static const CONNECTED:String="mediaConnected";
    public static const BUFFERING:String="mediaBuffering";
    public static const PAUSED:String="mediaPaused";
    public static const PLAYING:String="mediaPlaying";
    public static const STOPPED:String="mediaStopped";
    public static const COMPLETE:String="mediaComplete";
    public static const META:String="mediaMeta";

    public function MediaEvent( type:String, a:Object = null ) {
      super( type, true );
      args=a;
    }

    override public function toString():String {
      return formatToString( "MediaEvent", "type", "eventPhase" );
    }

    override public function clone():Event {
      return new MediaEvent( type, args );
    }

    public var args:Object;
  }
}