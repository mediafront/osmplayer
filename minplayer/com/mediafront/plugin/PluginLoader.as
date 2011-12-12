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
package com.mediafront.plugin {
  import flash.events.*;
  import flash.display.*;
  import flash.utils.getDefinitionByName;
  import flash.display.DisplayObject;
  import flash.net.*;
  import com.mediafront.utils.Settings;
  import com.mediafront.utils.Utils;
  import com.mediafront.plugin.PluginEvent;

  public class PluginLoader extends Sprite {
    // Constructor.
    public function PluginLoader( pluginInfo:Object ) {
      super();

      info=pluginInfo;
      _syncFlags=0;
      _loaded=0;
      _loading=false;
      dependencyMap = new Object();

      // Set the visibility of this sprite based on plugin information.
      visible=pluginInfo.visible;

      // The current sync flag...
      var syncFlag:uint=1;

      // Iterate through all our dependencies.
      for each (var dependency:String in pluginInfo.dependencies) {
        // Store this value in our depency map.
        dependencyMap[dependency]=syncFlag;

        // Set a different sync flag for each dependency.
        _syncFlags |= ( 1 << syncFlag++ );//From 0000 to 0001
      }
    }

    // Try to load the plugin.
    public function loadPlugin( plugin:PluginLoader ):uint {
      // Check to see if we have a dependency on this plugin.
      if (! _loaded&&dependencyMap.hasOwnProperty(plugin.type)) {

        // Reset the sync bit for this dependency.
        _syncFlags &= ~(1 << dependencyMap[plugin.type]);

        // Try to load.
        load();
      }

      // Return if we are finished loading or not.
      return _loaded;
    }

    // Load the plugin.
    public function load( baseURL:String = null ):void {
      if (baseURL) {
        _baseURL=baseURL;
      }
      // Need to wait for all of our dependencies to be loaded first.
      if (! _syncFlags&&! _loading) {

        // Set our loading flag.
        _loading=true;

        if (info.definition) {
          // Try to load the plugin directly... if this doesn't work, then we will
          // fall back to loading the SWF file.
          try {
            // See if this object exists.
            var ClassReference:Class=getDefinitionByName(info.definition) as Class;
            addPlugin(new ClassReference());
          } catch (e:ReferenceError) {
            // If the class object does not exist, it will throw an exception to be caught here
            // where it will try to load the SWF file within the plugins folder. catch (e:ReferenceError) {
            // Load the SWF.
            loadSWF();
          }
        } else {
          loadSWF();
        }
      }
    }

    private function loadSWF():void {
      if( _baseURL ) {
        _swfLoader = new Loader();
        _swfLoader.contentLoaderInfo.addEventListener( Event.COMPLETE, pluginLoaded );
        _swfLoader.contentLoaderInfo.addEventListener( IOErrorEvent.IO_ERROR, errorHandler );

        var pluginURL:String="";
        pluginURL+=info.path.match(/^http(s)?\:\/\//)?'':_baseURL+"/";
        pluginURL+=info.path;
        _swfLoader.load( new URLRequest( pluginURL ) );
      }
    }

    // Typical error handler.
    private function errorHandler( event:IOErrorEvent ):void {
      Utils.debug( event.toString() );
    }

    // Called when the plugin SWF has finished loading.
    private function pluginLoaded( event:Event ):void {
      // Save the component.
      addPlugin( _swfLoader.content );
    }

    // Used the add a plugin object to the plugin loader.
    private function addPlugin( object:* ):void {
      // Assign the component to the object.
      component=object;

      // Add this component to the stage.
      addChild( component );

      // Now listen for when plugin is completely loaded.
      component.addEventListener( PluginEvent.PLUGIN_LOADED, onPluginLoaded );

      // Let the plugin manager know that a plugin has been added.
      dispatchEvent( new Event( PluginEvent.PLUGIN_ADDED ) );
    }

    // Called when a plugin has finished loading.
    private function onPluginLoaded( event:Event ):void {
      // Set our loaded flag to true, and loading flag to false.
      _loaded=1;
      _loading=false;

      // Stop the propogation so that the manager doesn't get the event.
      event.stopPropagation();

      // Dispatch our own event to the plugin manager to let him know the
      // pluin has finished loading.
      dispatchEvent( new Event( PluginEvent.PLUGIN_LOADED ) );
    }

    public function get type():String {
      return info.type;
    }

    public var component:*;
    public var dependencyMap:Object;
    public var info:Object;

    private var _loaded:uint;
    private var _loading:Boolean;
    private var _baseURL:String;

    private var _syncFlags:uint;
    private var _swfLoader:Loader;
  }
}