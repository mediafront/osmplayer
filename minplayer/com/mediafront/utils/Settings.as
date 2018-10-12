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
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
package com.mediafront.utils {
  import com.mediafront.utils.Utils;
  import flash.display.LoaderInfo;

  public class Settings extends Object {
    // A copy constructor...
    public function Settings( _settings:Object ) {
      super();
      if (_settings) {
        baseURL=_settings.baseURL;
        skin=_settings.skin;
        id=_settings.skin;
        config=_settings.config;
        debug=_settings.debug;
        settings=_settings.settings;
        loaderInfo=_settings.loaderInfo;
      }
    }

    public function setLoaderInfo( lInfo:LoaderInfo ):void {
      // Store the loader info.
      loaderInfo=lInfo;

      // Set the baseURL.
      if (loaderInfo.parameters.hasOwnProperty("baseURL")) {
        setValue( "baseURL", loaderInfo.parameters );
      } else {
        baseURL=getBaseURL(loaderInfo);
      }

      // Set the config file.
      if (loaderInfo.parameters.hasOwnProperty("config")) {
        setValue( "config", loaderInfo.parameters );
      }
    }

    // Set the settings.
    public function setSettings( _settings:Object ):void {
      settings=_settings;

      // Now load using our settings.
      loadSettings();
    }

    // Load the settings.
    public function loadSettings():void {
      // First go through all of the settings and set the defaults.
      for (var setting:String in settings) {
        setValue( setting, settings );
      }

      // Now go through all the parameters and override the defaults.
      for (setting in loaderInfo.parameters) {
        setValue( setting, loaderInfo.parameters );
      }
    }

    private function setValue( param:String, _settings:Object ):void {
      if (hasOwnProperty(param)) {
        this[param]=parseValue(typeof this[param],_settings[param]);
      }
    }

    private function parseValue( type:String, value:* ):* {
      switch ( type ) {
        case "boolean" :
          return parseBoolean( value );

        case "string" :
          return parseBoolean( value ) ? value : "";

        default :
          return value;
      }
    }

    private function getBaseURL( loaderInfo:LoaderInfo ):String {
      var paths:Array = new Array();
      var file:String=LoaderInfo(loaderInfo).url;
      if (file.search(/\?/)>=0) {
        paths=file.split(/\?/);
        file=paths[0];
      }
      paths=file.split(/[\\\/]/);

      paths.pop();
      return paths.join("/");
    }

    private function parseBoolean( value:* ):Boolean {
      return (!value || value=="false" || value=="none" || value=="0") ? false : true;
    }

    // All global settings go into the base.
    public var baseURL:String;
    public var skin:String="default";
    public var id:String="";
    public var config:String="config";
    public var debug:Boolean=false;
    public var settings:Object;
    public var loaderInfo:LoaderInfo;
  }
}