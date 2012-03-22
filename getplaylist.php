<?php
if (!function_exists('check_plain')) {
  function check_plain($text) {
    return (preg_match('/^./us', $text) == 1) ? htmlspecialchars($text, ENT_QUOTES, 'UTF-8') : '';
  }
}

require_once("playlist/Playlist.php");
header('Content-Type: application/xml; charset=ISO-8859-1');
$playlist = new Playlist( (isset($_GET['playlist']) ? check_plain($_GET['playlist']) : 'default') );
echo $playlist->getPlaylist();
?>