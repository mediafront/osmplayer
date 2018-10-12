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
package com.mediafront.utils {
  import flash.geom.Rectangle;
  import flash.external.ExternalInterface;
  import flash.net.URLLoader;
  import flash.net.URLRequest;
  import flash.net.URLRequestHeader;
  import flash.events.Event;
  import flash.events.IOErrorEvent;

  public class Utils {
    public static function debug( debugText:String, shouldDebug:Boolean = true ):void {
      if (shouldDebug) {
        trace( debugText );
        if (ExternalInterface.available) {
          ExternalInterface.call("onFlashPlayerDebug", debugText);
        }
      }
    }

    public static function loadFile( _file:String, onLoaded:Function, onError:Function ):void {
      var loader:URLLoader = new URLLoader();
      loader.addEventListener( Event.COMPLETE, onLoaded );
      loader.addEventListener( IOErrorEvent.IO_ERROR, onError );
      var request:URLRequest=new URLRequest(_file);
      request.requestHeaders.push( new URLRequestHeader("pragma", "no-cache") );
      try {
        loader.load( request );
      } catch (error:Error) {
        onError(null);
      }
    }

    public static function getLocalName( element:XML ):String {
      var elementName:String = (element.localName() as String);
      if (elementName) {
        return elementName.toLowerCase();
      }
      return "";
    }

    public static function getScaledRect( ratio:Number, rect:Rectangle ):Rectangle {
      var scaledRect:Rectangle=new Rectangle(rect.x,rect.y,rect.width,rect.height);

      if (ratio) {
        var newRatio:Number = (rect.width / rect.height);
        scaledRect.height = (newRatio > ratio) ? rect.height : Math.floor(rect.width / ratio);
        scaledRect.width = (newRatio > ratio) ? Math.floor(rect.height * ratio) : rect.width;
        scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
        scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
      }

      return scaledRect;
    }

    public static function getFileExtension( path:String ):String {
      return path.substring(path.lastIndexOf(".") + 1).toLowerCase();
    }

    public static var debugEnabled:Boolean=false;
  }
}