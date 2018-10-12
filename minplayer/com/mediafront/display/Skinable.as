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
  import com.mediafront.utils.Utils;

  import flash.display.*;
  import flash.events.*;
  import flash.net.*;

  public class Skinable extends Sprite {
    public function loadSkin( _skin:String ):void {
      skinPath=_skin;
      if (skinPath) {
        if (swfLoader) {
          swfLoader.unload();
        } else {
          loadSWF();
        }
      }
    }

    public function onResize( deltaX:Number, deltaY:Number ):void {
      if ( skin && (skin.onResize is Function) ) {
        skin.onResize( deltaX, deltaY );
      }
    }

    public function loadSWF():void {
      createLoader();
      swfLoader.load( new URLRequest( skinPath ) );
    }

    public function createLoader():void {
      if (! swfLoader) {
        swfLoader = new Loader();
        swfLoader.contentLoaderInfo.addEventListener( Event.UNLOAD, skinUnloaded );
        swfLoader.contentLoaderInfo.addEventListener( Event.COMPLETE, skinLoaded );
        swfLoader.contentLoaderInfo.addEventListener( IOErrorEvent.IO_ERROR, errorHandler );
      }
    }

    public function skinUnloaded( event:Event ):void {
      loadSWF();
    }

    public function skinLoaded( event:Event ):void {
      skin=MovieClip(swfLoader.content);
      if (skin) {
        if (skin.initialize is Function) {
          skin.initialize( this );
        }
        this.parent.addChild( skin );
        setSkin(skin);
      }
    }

    public function errorHandler( error:Object ):void {
      Utils.debug( error.toString() );
    }

    public function setSkin( _skin:MovieClip ):void {
      skin=_skin;
    }

    public override function get visible():Boolean {
      return skin ? skin.visible : false;
    }
    public override function set visible( _visible:Boolean ):void {
      if (skin) {
        skin.visible=_visible;
      }
    }
    public override function set x( _x:Number ):void {
      if (skin) {
        skin.x=_x;
      }
    }
    public override function set y( _y:Number ):void {
      if (skin) {
        skin.y=_y;
      }
    }
    public override function set width( _width:Number ):void {
      if (skin) {
        skin.width=_width;
      }
    }
    public override function get width():Number {
      return skin ? skin.width : 0;
    }
    public override function set height( _height:Number ):void {
      if (skin) {
        skin.height=_height;
      }
    }
    public override function get height():Number {
      return skin ? skin.height : 0;
    }

    public var skin:MovieClip;
    public var skinPath:String;
    public var swfLoader:Loader;
  }
}