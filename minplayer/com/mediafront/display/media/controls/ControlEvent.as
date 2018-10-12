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
package com.mediafront.display.media.controls {
  import flash.events.*;

  public class ControlEvent extends Event {
    public static const PLAY:String="controlPlay";
    public static const PAUSE:String="controlPause";
    public static const SEEK:String="controlSeek";
    public static const VOLUME:String="controlVolume";
    public static const TOGGLEFULL:String="controlToggleFull";
    public static const MENU:String="controlMenu";
    public static const CONTROL_SET:String="controlSet";
    public static const CONTROL_UPDATE:String="controlUpdate";

    public function ControlEvent( type:String, a:Object = null ) {
      super( type, true );
      args=a;
    }

    override public function toString():String {
      return formatToString( "ControlEvent", "type", "eventPhase" );
    }

    override public function clone():Event {
      return new ControlEvent( type, args );
    }

    public var args:Object;
  }
}