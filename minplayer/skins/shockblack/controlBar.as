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

//Hides the menuButton on the controlBar.
//menuButton.visible = false;

function initialize( _controlBar:* )
{
  // Store the controlbar object.
  controlBar = _controlBar;

  // Set the y position to the bottom of the player..
  this.y = (controlBar.stage.stageHeight - this.height - 5);

  // Hide the volume bar for now...
  volumeBar.visible = false;

  // Set the full and normal screen buttons.
  toggleFullScreen.normalScreen.visible = false;
  toggleFullScreen.fullScreen.visible = true;

  // Add an event listner when the mouse is over the mute button.
  mute.addEventListener( MouseEvent.MOUSE_OVER, onVolumeMuteOver );
  mute.buttonMode = true;
  mute.mouseChildren = false;

  volumeBar.addEventListener( MouseEvent.MOUSE_OVER, onVolumeOver );
  volumeBar.addEventListener( MouseEvent.MOUSE_OUT, onVolumeOut );

  controlBar.stage.addEventListener( MouseEvent.MOUSE_MOVE, onMove );
  this.addEventListener( MouseEvent.MOUSE_OVER, onControlOver );
  this.addEventListener( MouseEvent.MOUSE_OUT, onControlOut );
  mouseTimer.reset();
  mouseTimer.start();

  // Add event listener for the prev and next buttons.
  prev.addEventListener( MouseEvent.CLICK, onPrev );
  prev.buttonMode = true;
  prev.mouseChildren = false;

  next.addEventListener( MouseEvent.CLICK, onNext );
  next.buttonMode = true;
  next.mouseChildren = false;

  // Add an event handler when they click on the menu.
  menu.addEventListener( MouseEvent.CLICK, onMenu );
  menu.buttonMode = true;
  menu.mouseChildren = false;

  // Add the callbacks to control the tile.
  ExternalInterface.addCallback("setTitle", setTitle);

  // Set the size.
  setSize( controlBar.stage.stageWidth );
}

// Set the title of the control bar.
function setTitle( newTitle:String )
{
  title.text = newTitle;
}

function onPrev(event:MouseEvent)
{
  ExternalInterface.call("jQuery.media.loadPrev");
}

function onNext(event:MouseEvent)
{
  ExternalInterface.call("jQuery.media.loadNext");
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

function onMenu( event:MouseEvent )
{
  ExternalInterface.call( "onFlashPlayerMenu", controlBar.getSettings().id );
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
  next.x = newWidth - (bgWidth - next.x);
  duration.x = newWidth - (bgWidth - duration.x);
  volumeBar.x = newWidth - (bgWidth - volumeBar.x);
  menu.x = newWidth - (bgWidth - menu.x);
  textBack.width = newWidth - (bgWidth - textBack.width);
  title.width = newWidth - (bgWidth - title.width);
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