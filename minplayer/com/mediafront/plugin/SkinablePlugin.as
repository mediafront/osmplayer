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
package com.mediafront.plugin {
  import com.mediafront.utils.Utils;
  import com.mediafront.display.Skinable;
  import com.mediafront.utils.Settings;
  import com.mediafront.plugin.PluginEvent;

  import flash.system.Security;
  import flash.display.MovieClip;
  import flash.events.Event;

  public class SkinablePlugin extends Skinable {
    public function SkinablePlugin() {
      super();
      Security.allowDomain("*");
    }

    public function loadSettings( _settings:Object ):void {
      settings=_settings;
    }

    public override function loadSkin( _skinName:String ):void {
      var skinURL:String="";
      info.skin=info.skin.replace('%skin',settings.skin);
      skinURL+=info.skin.match(/^http(s)?\:\/\//) ? '' : settings.baseURL+"/";
      skinURL+=info.skin;
      Utils.debug("Loading Skin: " + skinURL, settings.debug);
      super.loadSkin( skinURL );
    }

    public override function setSkin( _skin:MovieClip ):void {
      dispatchEvent( new Event( PluginEvent.PLUGIN_LOADED ) );
    }

    public function getSettings():Object {
      return settings;
    }

    public function set info( pluginInfo:Object ):void {
      _info=pluginInfo;
    }

    public function get info():Object {
      return _info;
    }

    public function initialize( comps:Object ):void {
      components=comps;
    }

    public function onReady():void {
    }

    protected var components:Object;
    protected var settings:Object;
    private var _info:Object;
  }
}