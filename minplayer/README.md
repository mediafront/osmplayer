minPlayer - Because less IS more.
===================================

The goal of this project is to provide a slim, well documented, object oriented,
plugin-based "core" media player in which other players and libraries can build
on top of.  It is written using object oriented JavaScript and is continuously
integrated using JSLint, JSDoc, and Google Closure.

Multiple players - One single API.
-----------------------------------
It also allows for hot-swappable 3rd party API players by providing a common
API for all of these players so that they can be utilized in the same manner.
This means that once you develop for the minPlayer, one can easily bring in a
different player an your code will still function as it would for all the
others.  Out of the box, this player provides a common API for YouTube, Vimeo,
HTML5, and Flash with more on the way.

Everything is a plugin
-----------------------------------
Since this is a plugin-based media player, every displayable class must derive
from the plugin class, thereby, making it a plugin.  This includes the media
player itself.  This plugin system is highly flexible to be able to handle
just about any type of plugin imaginable, and allows for every plugin to have
direct dependeny-injected control over any other plugin within the media player.

Complete User Interface & Business Logic separation
-----------------------------------
One common complaint for many media solutions out there is that they hijack the
DOM and build out their own controls to provide consistency amongst different
browsers.  They do this, however, within the core player which completely binds
the user interface to the business logic of the media player.  The minPlayer
takes a different approach by keeping ALL user interface functionality within
the "templates" directory, where each template essentially derives from the base
Business logic classes only to provide the user interface aspects of that control.
This allows for easy templating of the media player besides just overriding the
CSS like current media solutions do today.

No "Features"!
-----------------------------------
I am pleased to say that this media player does NOT have many features, and this
is on purpose.  Since this is a "core" player, it does not have any features
other than what is critical in presenting your media.  Any additional "bling"
will be added to this player from different repositories and from different
players that extend this "core" functionality.  This methodology will keep this
"core" media solution lean & highly functional.

API
-----------------------------------
The API for minPlayer is very simple.  It revolves around a single API that is
able to retrieve any plugin even before that plugin is created.  By doing this,
you can have complete control over any plugin within the minPlayer.  This API
is simply called

```
minplayer.get();
```

This API can take up to three different argument with each argument providing
different usage.  The code docs for this function are as follows...

```
/**
 * The main API for minPlayer.
 *
 * Provided that this function takes three parameters, there are 8 different
 * ways to use this api.
 *
 *   id (0x100) - You want a specific player.
 *   plugin (0x010) - You want a specific plugin.
 *   callback (0x001) - You only want it when it is ready.
 *
 *   000 - You want all plugins from all players, ready or not.
 *
 *          var instances = minplayer.get();
 *
 *   001 - You want all plugins from all players, but only when ready.
 *
 *          minplayer.get(function(plugin) {
 *            // Code goes here.
 *          });
 *
 *   010 - You want a specific plugin from all players, ready or not...
 *
 *          var medias = minplayer.get(null, 'media');
 *
 *   011 - You want a specific plugin from all players, but only when ready.
 *
 *          minplayer.get('player', function(player) {
 *            // Code goes here.
 *          });
 *
 *   100 - You want all plugins from a specific player, ready or not.
 *
 *          var plugins = minplayer.get('player_id');
 *
 *   101 - You want all plugins from a specific player, but only when ready.
 *
 *          minplayer.get('player_id', null, function(plugin) {
 *            // Code goes here.
 *          });
 *
 *   110 - You want a specific plugin from a specific player, ready or not.
 *
 *          var plugin = minplayer.get('player_id', 'media');
 *
 *   111 - You want a specific plugin from a specific player, only when ready.
 *
 *          minplayer.get('player_id', 'media', function(media) {
 *            // Code goes here.
 *          });
 *
 * @this The context in which this function was called.
 * @param {string} id The ID of the widget to get the plugins from.
 * @param {string} plugin The name of the plugin.
 * @param {function} callback Called when the plugin is ready.
 * @return {object} The plugin object if it is immediately available.
 */
minplayer.get = function(id, plugin, callback) {
};
```

Thanks and enjoy minPlayer.