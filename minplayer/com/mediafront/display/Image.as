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
  import flash.net.*;
  import flash.display.*;
  import flash.geom.*;
  import flash.events.*;

  public class Image extends Sprite {
    public function loadImage( imagePath:String, _boundingRect:Rectangle = null ):void {
      boundingRect=_boundingRect;
      boundingRect=boundingRect?boundingRect:getRect(this);

      // Only load an image who's path is defined.
      if (imagePath) {
        currentLoader=createImageLoader();

        var request:URLRequest=new URLRequest(imagePath);
        request.requestHeaders.push( new URLRequestHeader("pragma", "no-cache") );

        // Try to load the image.
        try {
          currentLoader.load(request);
        } catch (e:Error) {
          Utils.debug( "Error loading image." );
        }
      }
    }

    public function createImageLoader():Loader {
      clearImage();
      var loader:Loader = new Loader();
      loader.contentLoaderInfo.addEventListener( Event.COMPLETE, onImageLoaded );
      loader.contentLoaderInfo.addEventListener( IOErrorEvent.IO_ERROR, onError );
      loader.addEventListener( IOErrorEvent.IO_ERROR, onError );
      addChild( loader );
      return loader;
    }

    public function clearImage() {
      var i:int=numChildren;
      while (i--) {
        var field:* =getChildAt(i);
        if (field is Loader) {
          field.unload();
          field.contentLoaderInfo.removeEventListener( Event.COMPLETE, onImageLoaded );
          field.contentLoaderInfo.removeEventListener( IOErrorEvent.IO_ERROR, onError );
          field.removeEventListener( IOErrorEvent.IO_ERROR, onError );
          removeChild( field );
        }
      }
    }

    public function resize( newRect:Rectangle ) {
      if (currentLoader) {
        var imageRect:Rectangle=Utils.getScaledRect(imageRatio,newRect);
        currentLoader.width=imageRect.width;
        currentLoader.height=imageRect.height;
        currentLoader.x=imageRect.x;
        currentLoader.y=imageRect.y;
      }
    }

    private function onImageLoaded( event:Event ) {
      if (boundingRect&&event.target) {
        // Get the image ratio of the loaded image.
        imageRatio=event.target.width/event.target.height;

        // Resize to the image to our bounding rectangle.
        resize( boundingRect );

        // Trigger an event that the image has been added.
        dispatchEvent( new Event( Event.ADDED ) );
      }
    }

    private function onError( e:IOErrorEvent ) {
      // For now, just give out a trace that an error has occured.
      Utils.debug( e.toString() );
    }

    // The current loader variable.
    private var currentLoader:Loader;

    // The bounding rectangle for this image.
    private var boundingRect:Rectangle;

    // The width/height ratio of the loaded image.
    public var imageRatio:Number=1.3333;
  }
}