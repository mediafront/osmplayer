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
  import com.mediafront.plugin.SkinablePlugin;
  import com.mediafront.plugin.PluginEvent;
  import com.mediafront.utils.Settings;
  import com.mediafront.utils.MediaSettings;
  import com.mediafront.utils.Utils;

  import flash.display.*;
  import flash.events.*;

  public class Menu extends SkinablePlugin {
    public function Menu() {
      super();
    }

    public override function loadSettings( _settings:Object ):void {
      super.loadSettings( new MenuSettings( _settings ) );
      super.loadSkin( settings.menu );
    }

    public override function setSkin( _skin:MovieClip ):void {
      super.setSkin( _skin );
    }

    public override function onReady():void {
      super.onReady();
    }

    public override function onResize( deltaX:Number, deltaY:Number ):void {
      super.onResize( deltaX, deltaY );
    }
  }
}