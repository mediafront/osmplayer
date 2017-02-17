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
package com.mediafront.display.media.controls
{
	import com.mediafront.display.Skinable;
	import com.mediafront.display.media.MediaEvent;	
	import com.mediafront.plugin.IPlugin;
	import com.mediafront.plugin.PluginEvent;
	import com.mediafront.utils.Settings;			
	import com.mediafront.utils.PlayLoaderSettings;	
	
   import flash.display.*;
	import flash.text.TextField;
	import flash.events.*;
	import flash.system.Security;		

   public class PlayLoader extends Skinable implements IPlugin
   {
		public function PlayLoader()
		{
			super();
			Security.allowDomain("*");		
		}
		
		public function loadSettings( settings:Settings ) : void
		{
			_settings = new PlayLoaderSettings( settings );
			loadSkin( settings.baseURL + "/skins/" + _settings.skin + "/" + _settings.playLoader + ".swf" );			
		}
		
		public function initialize( comps:Object ) : void
		{
			components = comps;
			components.mediaPlayer.addEventListener( MediaEvent.PLAYING, onMediaEvent );
			components.mediaPlayer.addEventListener( MediaEvent.PAUSED, onMediaEvent );		
			components.mediaPlayer.addEventListener( MediaEvent.BUFFERING, onMediaEvent );	
		}		
		
		public function onReady() : void {}
		
		public override function setSkin( _skin:MovieClip )
      {
         playButton = _skin.playButton;
			if( playButton ) {
				playButton.buttonMode = true;
				playButton.mouseChildren = false;
				playButton.addEventListener( MouseEvent.CLICK, onPlay );
			}
         loader = _skin.loader;
         setPlayLoadState( true, true, false );
			dispatchEvent( new PluginEvent( PluginEvent.PLUGIN_LOADED ) );
      }		
		
		public function onPlay( event:MouseEvent )
		{
			onMediaEvent( new MediaEvent( MediaEvent.PLAYING ) );	
			components.mediaPlayer.playMedia();
		}		
		
		public function onMediaEvent( event:* )
		{		
		   if( skin ) {
			   switch( event.type ) {
			      case MediaEvent.BUFFERING:
			         setPlayLoadState( true, true, false );
			         break;
				   case MediaEvent.PLAYING:
	               setPlayLoadState( false, false, false );					
					   break;
				   case MediaEvent.PAUSED:
				      setPlayLoadState( true, false, true );
					   break;
			   }	
			}		
		}		
		
		public function setPlayLoadState( showSkin:Boolean, showLoader:Boolean, showPlay:Boolean ) 
		{
		   if( skin ) {
		      skin.visible = showSkin;
		   }
   		
		   if( loader ) {
		      loader.visible = showLoader;
		   }
   		
		   if( playButton ) {
		      playButton.visible = showPlay;
		   }		   
		}
		
      public var playButton:MovieClip;
      public var loader:MovieClip;
		private var components:Object;
		private var _settings:PlayLoaderSettings;
   }
}