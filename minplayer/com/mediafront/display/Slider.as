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
package com.mediafront.display {
  import com.mediafront.display.media.controls.ControlEvent;

  import flash.events.*;
  import flash.geom.*;
  import flash.display.*;
  import flash.utils.*;

  public class Slider extends Skinable {
    public function Slider( _skin:* ) {
      super();
      setSkin( _skin );
    }

    public override function setSkin( _skin:MovieClip ):void {
      super.setSkin( _skin );

      handle=_skin.handle;
      if (handle) {
        handle.buttonMode=true;
        handle.mouseChildren=false;
        handle.addEventListener( MouseEvent.MOUSE_DOWN, onHandleDown );
        handle.addEventListener( MouseEvent.MOUSE_UP, onHandleUp );
      }

      track=_skin.track;
      if (track) {
        track.buttonMode=true;
        track.addEventListener( MouseEvent.CLICK, onSetValue );
        dragRect = new Rectangle( track.x, track.y, (track.width - handle.width), 0 );
      }

      fullness=_skin.fullness;

      dragTimer=new Timer(250);
      dragTimer.stop();
      dragTimer.addEventListener( TimerEvent.TIMER, onDragTimer );
    }

    public function setValue( newValue:Number ):void {
      setPosition( newValue );
      dispatchEvent( new ControlEvent( ControlEvent.CONTROL_SET ) );
    }

    public function updateValue( newValue:Number, setHandle:Boolean = true ):void {
      setPosition( newValue, setHandle );
      dispatchEvent( new ControlEvent( ControlEvent.CONTROL_UPDATE ) );
    }

    public function setPosition( newValue:Number, setHandle:Boolean = true ):void {
      newValue = (newValue < 0) ? 0 : newValue;
      newValue = (newValue > 1) ? 1 : newValue;
      value=newValue;
      var fullWidth = (value * (track.width - handle.width));

      if (fullness) {
        fullness.width=fullWidth;
      }

      if (handle&&setHandle) {
        handle.x=track.x+fullWidth;
      }
    }

    private function onSetValue( event:MouseEvent ):void {
      setValue( (event.localX * event.currentTarget.scaleX) / (track.width - handle.width) );
    }

    private function onTrackOut( event:MouseEvent ):void {
      dragTimer.stop();
      dragging=false;
      event.target.stopDrag();
      event.target.removeEventListener( MouseEvent.MOUSE_MOVE, onDrag );
    }

    private function onHandleDown( event:MouseEvent ):void {
      dragTimer.start();
      dragging=true;
      event.target.startDrag(false, dragRect);
      event.target.addEventListener( MouseEvent.MOUSE_MOVE, onDrag );
    }

    private function onHandleUp( event:MouseEvent ):void {
      onTrackOut( event );
      setValue( dragValue );
    }

    private function onDragTimer( e:TimerEvent ):void {
      updateValue( dragValue, false );
    }

    private function onDrag(event:MouseEvent):void {
      dragValue = (event.target.x - track.x) / (track.width - handle.width);
    }

    public var value:Number=0;
    public var handle:MovieClip;
    public var track:MovieClip;
    public var fullness:MovieClip;
    public var dragTimer:Timer;
    public var dragRect:Rectangle;
    public var dragValue:Number=0;
    public var dragging:Boolean=false;
  }
}