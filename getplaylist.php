<?php
require_once("playlist/Playlist.php");
header('Content-Type: application/xml; charset=ISO-8859-1');
$playlist = new Playlist( (isset($_GET['playlist']) ? $_GET['playlist'] : 'default') );
echo $playlist->getPlaylist();   
?>