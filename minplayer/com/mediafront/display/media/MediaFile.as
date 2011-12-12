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

  public class MediaFile {
    public var path:String="";
    public var stream:String=null;
    public var extension:String="";
    public var mediaType:String="";
    public var loaded:Boolean=false;

    public function MediaFile( file:Object ) {
      path=file.path;
      stream=file.stream;
      loaded=false;
      extension=file.extension?file.extension:Utils.getFileExtension(path);
      mediaType=file.mediaType?file.mediaType:getMediaType();
    }

    public function isValid():Boolean {
      return (mediaType != "");
    }

    private function getMediaType():String {
      switch ( extension ) {
        case "swf" :
          return "swf";

        case "flv" :
        case "f4v" :
        case "mp4" :
        case "m4v" :
        case "mov" :
        case "3g2" :
        case "ogg" :
        case "ogv" :
          return "video";

        case "mp3" :
        case "m4a" :
        case "aac" :
        case "wav" :
        case "aif" :
        case "wma" :
        case "oga" :
          return "audio";

        default :
          return "video";
      }
    }
  }
}