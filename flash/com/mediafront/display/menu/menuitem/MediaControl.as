/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com 
 *
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
package com.mediafront.display.menu.menuitem
{
	import com.mediafront.display.Skinable;
	import com.mediafront.display.menu.MenuEvent
	import com.mediafront.plugin.IPlugin;
	import com.mediafront.plugin.PluginEvent;
	import com.mediafront.utils.Settings;	
	import com.mediafront.utils.MenuSettings;
	
	import flash.display.MovieClip;
	import flash.system.Security;	
	
	public class MediaControl extends Skinable implements IPlugin
	{
		public function MediaControl()
		{
			super();
			Security.allowDomain("*");		
		}		
		
		public function loadSettings( settings:Settings ) : void
		{
			_settings = new MenuSettings( settings );
			loadSkin( settings.baseURL + "/skins/" + _settings.skin + "/" + _settings.mediaControl + ".swf" );						
		}
		
		public override function setSkin( _skin:MovieClip ) : void
      {
			_skin.visible = mediaControlVisible;
      }		
		
		public function initialize( comps:Object ) : void
		{
			
		}
		
		public function onReady() : void {}
		
		public function onMenuEvent() : void
		{
			skin.showMediaControl();
		}
		
		public var mediaControlVisible:Boolean = false;
		private var components:Object;
		public var _settings:MenuSettings;
	}	
}