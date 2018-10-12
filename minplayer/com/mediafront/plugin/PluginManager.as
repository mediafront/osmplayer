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
  import com.mediafront.utils.Settings;
  import com.mediafront.utils.Utils;
  import com.mediafront.plugin.PluginEvent;
  import com.mediafront.plugin.PluginLoader;

  import flash.events.Event;
  import flash.display.*;
  import flash.events.TimerEvent;
  import flash.system.Security;
  import flash.utils.Timer;
  import flash.external.ExternalInterface;
  import flash.display.Stage;
  import flash.display.StageDisplayState;
  import flash.system.Capabilities;

  public class PluginManager extends Sprite {
    // Constructor.
    public function PluginManager() {
      super();

      // Allow control for laoded SWF's
      Security.allowDomain("*");

      // Store the size of this player.
      _lastWidth=stage.stageWidth;
      _lastHeight=stage.stageHeight;

      // Set the stage properties.
      stage.scaleMode=StageScaleMode.NO_SCALE;
      stage.align=StageAlign.TOP_LEFT;
      stage.addEventListener(Event.RESIZE, resizeHandler);

      // Initialize our plugins object.
      _plugins = new Object();

      // Create our settings object.
      _settings=new Settings(null);
      _settings.setLoaderInfo( stage.loaderInfo );

      // Check to see if the external interface is ready.
      if (ExternalInterface.available||isDebugBuild()) {
        // If so, then load the plugin manager.
        loadManager();
      } else {
        // Otherwise, start a check interval.
        startTimerCheck();
      }
    }

    // Returns true if the swf is built in debug mode
    public static function isDebugBuild():Boolean {
      return new Error().getStackTrace().search(/:[0-9]+]$/m) > -1;
    }

    // Loads the player.
    private function loadManager():void {
      // Add our JavaScript callbacks.
      addCallbacks();

      // Load the configuration file.
      loadConfigFile( _settings.config );
    }

    // Start a timer check.
    private function startTimerCheck() {
      // Declare the readyTime if we have not already done so.
      if (! _readyTimer) {
        _readyTimer=new Timer(200);
        _readyTimer.addEventListener(TimerEvent.TIMER, timerHandler);
      }

      // Start the ready timer.
      _readyTimer.start();
    }

    // Check the gateway every timer interval.
    private function timerHandler(event:TimerEvent):void {
      if (ExternalInterface.available) {
        _readyTimer.stop();
        loadManager();
      }
    }

    // Allow external components to load plugins.
    private function addCallbacks():void {
      try {
        ExternalInterface.addCallback( "loadConfig", loadConfig );
        ExternalInterface.addCallback( "loadConfigFile", loadConfigFile );
        ExternalInterface.addCallback( "loadPlugins", loadPlugins );
        ExternalInterface.addCallback( "loadPlugin", loadPlugin );
        ExternalInterface.addCallback( "showPlugin", showPlugin );
      } catch (error:Error) {
        Utils.debug("An Error occurred: " + error.message + "\n");
      }
    }

    // Load the provided configuration.
    public function loadConfigFile( config:String ):void {
      if (config) {
        var xmlURL:String="";
        xmlURL+=_settings.baseURL+"/";
        xmlURL+="config/"+config+".xml";
        Utils.loadFile( xmlURL, onConfigLoad, onConfigLoadError );
      }
    }

    // Load the player with a configuration object.
    public function loadConfig( config:Object ):void {
      // Set the settings.
      _settings.setSettings( config.settings );

      // Now load the plugins.
      loadPlugins( config.plugins );
    }

    // Load a series of plugins.
    public function loadPlugins( plugins:Array ):void {
      // Iterate through all of our plugins and add them.
      for each (var pluginInfo:Object in plugins) {
        loadPlugin( pluginInfo );
      }
    }

    // Load a single plugin
    public function loadPlugin( pluginInfo:Object ):void {
      // Tell the outside world what is going on.
      Utils.debug("Loading Plugin: " + pluginInfo.name, _settings.debug );

      // Create the plugin and add the event listeners.
      var plugin:PluginLoader=new PluginLoader(pluginInfo);
      plugin.addEventListener( PluginEvent.PLUGIN_ADDED, onPluginAdded );
      plugin.addEventListener( PluginEvent.PLUGIN_LOADED, onPluginLoaded );

      // Add the plugin to the stage.
      addChild( plugin );

      // If this type has not beed added yet, we need to create an array to add this to.
      if (! _plugins.hasOwnProperty(pluginInfo.type)) {
        _plugins[pluginInfo.type] = new Array();
      }

      // Add the plugin to the plugins array.
      _plugins[pluginInfo.type].push(plugin);

      // Now load the plugin.
      plugin.load(_settings.baseURL);
    }

    // Hide or show a plugin.
    public function showPlugin( type:String, show:Boolean ):void {
      Utils.debug(type);
      for each (var plugin:PluginLoader in _plugins[type]) {
        plugin.visible=show;
      }
    }

    // Called when the configuration file is loaded.
    private function onConfigLoad(event:Event):void {
      // Get the configuration XML.
      var configXML:XML=new XML(event.target.data);
      var config:Object = {settings:{}, plugins:new Array()};

      // Iterate through the settings from the XML.
      for each (var setting:XML in configXML.settings.children()) {
        config.settings[Utils.getLocalName(setting)]=setting.children().toString();
      }

      // Iterate through the plugins from the XML.
      for each (var plugin:XML in configXML.plugins.plugin) {

        // Get all the dependencies for this plugin.
        var dependencies:Array = new Array();
        for each (var dependency:XML in plugin.dependencies.elements()) {
          dependencies.push( dependency.children().toString() );
        }

        // Add this to the plugins of our config object.
        config.plugins.push({
          name:plugin.name.children().toString(),
          definition:plugin.definition.children().toString(),
          path:plugin.path.children().toString(),
          skin:plugin.skin.children().toString(),
          type:plugin.type.children().toString(),
          visible:(plugin.visible.children().toString() == 'false' ? false : true),
          dependencies:dependencies
        });
      }

      // Now load the configuration.
      loadConfig( config );
    }

    // Called when the configuration fails to load.
    private function onConfigLoadError(event:Object):void {
      Utils.debug( event.toString() );
    }

    // Called when a plugin has been added to the stage.
    private function onPluginAdded( event:Event ):void {
      // Get the loaded plugin.
      var loadedPlugin:PluginLoader = (event.target as PluginLoader);

      // Set the info.
      loadedPlugin.component.info=loadedPlugin.info;

      // Load the settings.
      loadedPlugin.component.loadSettings( (_settings as Object) );
    }

    // Called when a plugin has finished loading.
    private function onPluginLoaded( event:Event ):void {
      // Get the loaded plugin.
      var loadedPlugin:PluginLoader = (event.target as PluginLoader);

      // Tell the outside world what just happened.
      Utils.debug("Plugin Loaded: " + loadedPlugin.name, _settings.debug );

      // Iterate through all of this plugins dependencies and contruct
      // and object of only the components that this plugin is dependent on.
      var components:Object = new Object();
      for( var dependency:String in loadedPlugin.dependencyMap ) {;
      components[dependency]=_plugins[dependency][0].component;
    }

    // Pass our components into our loaded Plugin.
    loadedPlugin.component.initialize( components );

    // See if all the plugins have finished loading.
    var allLoaded:uint=1;

    // Now iterate through all of our plugins
    for each (var instances:Array in _plugins) {

      // Iterate through all of the plugin instances.
      for each (var plugin:PluginLoader in instances) {

        // Load this plugin, and let us know if it is fully loaded.
        allLoaded*=plugin.loadPlugin(loadedPlugin);
      }
    }

    // If all the plugins have finished loading, then we need to signal them accordingly.
    if (allLoaded) {
      // Tell the outside world what just happened.
      Utils.debug( "All Plugins Loaded!", _settings.debug );

      onReady();
    }
  }

  // Called when all plugins are ready to go.
  private function onReady():void {
    // Iterate through all plugin instances.
    for each (var instances:Array in _plugins) {
      for each (var plugin:PluginLoader in instances) {

        // Call the onReady function.
        plugin.component.onReady();
      }
    }

    if (ExternalInterface.available&&_settings) {
      ExternalInterface.call( "onFlashPlayerReady", _settings.id );
    }
  }

  // Called when the player is resizing.
  private function resizeHandler(event:Event):void {
    if (stage) {
      // Calculate the change in size.
      var deltaX:Number = (stage.stageWidth - _lastWidth);
      var deltaY:Number = (stage.stageHeight - _lastHeight);

      // Iterate through all of our plugin instances.
      for each (var instances:Array in _plugins) {
        for each (var plugin:PluginLoader in instances) {
          if (plugin.component) {
            // Call the resize function on this plugin.
            plugin.component.onResize( deltaX, deltaY );
          }
        }
      }

      // Save the width and height.
      _lastWidth=stage.stageWidth;
      _lastHeight=stage.stageHeight;
    }
  }

  private var _plugins:Object;
  private var _settings:Settings;
  private var _lastWidth:Number;
  private var _lastHeight:Number;
  private var _readyTimer:Timer;
}
}