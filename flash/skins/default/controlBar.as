import fl.transitions.*;
import fl.transitions.easing.*;

var mouseTimer:Timer = new Timer( 4000, 1 );
mouseTimer.stop();
mouseTimer.addEventListener( TimerEvent.TIMER, onMouseTimer );

var controlTween = new Tween( this, "alpha", Strong.easeIn, this.alpha, 0, 8 );
controlTween.stop();

//Hides the menuButton on the controlBar.
//menuButton.visible = false;

function initialize( controlBar:* ) 
{
	// Set the x position to the middle of the stage.
	this.x = (controlBar.stage.stageWidth - this.width) / 2;
	
	// Set the y position to the bottom of the player..
	this.y = (controlBar.stage.stageHeight - this.height - 10);
	
	controlBar.stage.addEventListener( MouseEvent.MOUSE_MOVE, onMove );
	mouseTimer.reset();
	mouseTimer.start();	
}

function onMove( event:MouseEvent ) 
{
	showControls();
}

function onMouseTimer( event:TimerEvent ) 
{
	controlTween.begin = this.alpha;
	controlTween.finish = 0;
	controlTween.start();
}

function showControls() 
{
	controlTween.stop();	
	this.visible = true;
	this.alpha = 1;
	mouseTimer.reset();
	mouseTimer.start();
}

function onResize( deltaX:Number, deltaY:Number ) 
{
	this.x = this.x + (deltaX / 2);
	this.y = this.y + deltaY;
	showControls();
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