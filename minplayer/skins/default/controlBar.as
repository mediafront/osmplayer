import fl.transitions.*;
import fl.transitions.easing.*;
import flash.external.ExternalInterface;

var mouseOverVolume = false;
var mouseOverControls = false;

var mouseTimer:Timer = new Timer( 4000, 1 );
mouseTimer.stop();
mouseTimer.addEventListener( TimerEvent.TIMER, onMouseTimer );

var volumeTimer:Timer = new Timer( 4000, 1 );
volumeTimer.stop();
volumeTimer.addEventListener( TimerEvent.TIMER, onVolumeTimer );

var controlTween = new Tween( this, "alpha", Strong.easeIn, this.alpha, 0, 8 );
controlTween.stop();

var volumeTween = new Tween(volumeBar, "alpha", Strong.easeIn, volumeBar.alpha, 0, 8 );
volumeTween.stop();

// The ControlBar object.
var controlBar = null;

function initialize( _controlBar:* )
{
  // Store the controlbar object.
  controlBar = _controlBar;

  // Set the y position to the bottom of the player..
  this.y = (controlBar.stage.stageHeight - background.height - 10);

  // Hide the volume bar for now...
  volumeBar.visible = false;

  // Set the full and normal screen buttons.
  toggleFullScreen.normalScreen.visible = false;
  toggleFullScreen.fullScreen.visible = true;

  // Add an event listner when the mouse is over the mute button.
  mute.addEventListener( MouseEvent.MOUSE_OVER, onVolumeMuteOver );
  volumeBar.addEventListener( MouseEvent.MOUSE_OVER, onVolumeOver );
  volumeBar.addEventListener( MouseEvent.MOUSE_OUT, onVolumeOut );

  controlBar.stage.addEventListener( MouseEvent.MOUSE_MOVE, onMove );
  this.addEventListener( MouseEvent.MOUSE_OVER, onControlOver );
  this.addEventListener( MouseEvent.MOUSE_OUT, onControlOut );
  mouseTimer.reset();
  mouseTimer.start();

  // Set the size.
  setSize( controlBar.stage.stageWidth );
}

function onVolumeOver( event:MouseEvent ) { mouseOverVolume = true; }
function onVolumeOut( event:MouseEvent )  { mouseOverVolume = false; }
function onControlOver( event:MouseEvent ) { mouseOverControls = true; }
function onControlOut( event:MouseEvent ) { mouseOverControls = false; }
function onVolumeMuteOver( event:MouseEvent ) { showVolume(); }
function onMove( event:MouseEvent ) { showControls(); }

function onMouseTimer( event:TimerEvent )
{
  if(!mouseOverControls && !mouseOverVolume) {
    controlTween.begin = this.alpha;
    controlTween.finish = 0;
    controlTween.start();
  }
  else {
    mouseTimer.reset();
    mouseTimer.start();
  }
}

function onVolumeTimer( event:TimerEvent )
{
  if(!mouseOverVolume) {
    volumeTween.begin = volumeBar.alpha;
    volumeTween.finish = 0;
    volumeTween.start();
  }
  else {
    volumeTimer.reset();
    volumeTimer.start();
  }
}

function showControls()
{
  controlTween.stop();
  this.visible = true;
  this.alpha = 1;
  mouseTimer.reset();
  mouseTimer.start();
}

function showVolume()
{
  volumeTween.stop();
  volumeBar.visible = true;
  volumeBar.alpha = 1;
  volumeTimer.reset();
  volumeTimer.start();
}

function onResize( deltaX:Number, deltaY:Number )
{
  this.y = this.y + deltaY;
  setFullScreenState();
  setSize( controlBar.stage.stageWidth );
  showControls();
}

function setFullScreenState()
{
  if( controlBar.stage.displayState == StageDisplayState.FULL_SCREEN ) {
    toggleFullScreen.normalScreen.visible = true;
    toggleFullScreen.fullScreen.visible = false;
  }
  else {
    toggleFullScreen.normalScreen.visible = false;
    toggleFullScreen.fullScreen.visible = true;
  }
}

function setSize( newWidth:Number )
{
  var bgWidth = background.width;
  toggleFullScreen.x = newWidth - (bgWidth - toggleFullScreen.x);
  mute.x = newWidth - (bgWidth - mute.x);
  duration.x = newWidth - (bgWidth - duration.x);
  volumeBar.x = newWidth - (bgWidth - volumeBar.x);
  seekBar.track.width = newWidth - (bgWidth - seekBar.track.width);
  seekBar.fullness.width = newWidth - (bgWidth - seekBar.fullness.width);
  seekBar.progress.width = newWidth - (bgWidth - seekBar.progress.width);
  if( controlBar.seekBar && controlBar.seekBar.track ) {
    controlBar.seekBar.track.width = seekBar.track.width;
  }
  if( controlBar.seekBar && controlBar.seekBar.fullness ) {
    controlBar.seekBar.fullness.width = seekBar.fullness.width;
  }
  background.width = newWidth;
}

function formatTime(mediaTime:Number) : Object
{
  var seconds:Number = 0;
  var minutes:Number = 0;
  var hour:Number = 0;

  hour = Math.floor(mediaTime / 3600);
  mediaTime -= (hour * 3600);
  minutes = Math.floor( mediaTime / 60 );
  mediaTime -= (minutes * 60);
  seconds = Math.floor(mediaTime % 60);

  var timeString:String = "";

  if( hour ) {
    timeString += String(hour);
    timeString += ":";
  }

  timeString += (minutes >= 10) ? String(minutes) : ("0" + String(minutes));
  timeString += ":";
  timeString += (seconds >= 10) ? String(seconds) : ("0" + String(seconds));
  return {time:timeString, units:""};
}