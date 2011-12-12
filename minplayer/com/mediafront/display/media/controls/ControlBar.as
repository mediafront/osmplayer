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
package com.mediafront.display.media.controls {
  import com.mediafront.utils.Utils;
  import com.mediafront.plugin.SkinablePlugin;
  import com.mediafront.display.Slider;
  import com.mediafront.display.media.MediaEvent;
  import com.mediafront.display.media.controls.ControlEvent;
  import com.mediafront.plugin.PluginEvent;
  import com.mediafront.utils.Settings;
  import com.mediafront.utils.ControlSettings;
  import flash.utils.Timer;
  import flash.display.*;
  import flash.text.TextField;
  import flash.events.*;
  import flash.system.Security;
  import flash.external.ExternalInterface;

  public class ControlBar extends SkinablePlugin {
    public override function loadSettings( _settings:Object ):void {
      super.loadSettings( new ControlSettings( _settings ) );
      super.loadSkin( settings.controlBar );
    }

    public override function initialize( comps:Object ):void {
      super.initialize( comps );
      components.mediaPlayer.addEventListener( MediaEvent.CONNECTED, onMediaEvent );
      components.mediaPlayer.addEventListener( MediaEvent.PLAYING, onMediaEvent );
      components.mediaPlayer.addEventListener( MediaEvent.PAUSED, onMediaEvent );
      components.mediaPlayer.addEventListener( MediaEvent.STOPPED, onMediaEvent );
      components.mediaPlayer.addEventListener( MediaEvent.META, onMediaEvent );
    }

    public override function setSkin( _skin:MovieClip ):void {
      updateTimer=new Timer(1000);
      updateTimer.stop();
      updateTimer.addEventListener( TimerEvent.TIMER, onMediaUpdate );

      progressTimer=new Timer(500);
      progressTimer.stop();
      progressTimer.addEventListener( TimerEvent.TIMER, onMediaProgress );

      volumeBar=new Slider(_skin.volumeBar);
      if (volumeBar) {
        volumeBar.addEventListener( ControlEvent.CONTROL_SET, onVolume );
      }

      seekBar=new Slider(_skin.seekBar);
      if (seekBar) {
        seekBar.addEventListener( ControlEvent.CONTROL_SET, onSeek );
      }

      playPauseButton=_skin.playPauseButton;
      if (playPauseButton) {
        playPauseButton.buttonMode=true;
        playPauseButton.mouseChildren=false;
        playPauseButton.addEventListener( MouseEvent.CLICK, onPlayPause );
      }

      toggleFullScreen=_skin.toggleFullScreen;
      if (toggleFullScreen) {
        toggleFullScreen.buttonMode=true;
        toggleFullScreen.mouseChildren=false;
        toggleFullScreen.addEventListener( MouseEvent.CLICK, onToggleFullScreen );
      }

      menuButton=_skin.menuButton;
      if (menuButton) {
        menuButton.buttonMode=true;
        menuButton.mouseChildren=false;
        menuButton.addEventListener( MouseEvent.CLICK, onMenu );
      }

      mute=_skin.mute;
      if (mute) {
        mute.buttonMode=true;
        mute.mouseChildren=false;
        mute.addEventListener( MouseEvent.CLICK, onMute );
      }

      playTime=_skin.playTime;
      duration=_skin.duration;

      playState=true;
      muteState=false;
      setPlayState( false );
      super.setSkin( _skin );
    }

    public override function onResize( deltaX:Number, deltaY:Number ):void {
      super.onResize( deltaX, deltaY );
      volumeBar.onResize( deltaX, deltaY );
      seekBar.onResize( deltaX, deltaY );
    }

    public function onMediaEvent( event:* ):void {
      switch ( event.type ) {
        case MediaEvent.CONNECTED :
          progressTimer.start();
          totalTime=0;
          break;
        case MediaEvent.PLAYING :
          updateTimer.start();
          setPlayState( true );
          break;
        case MediaEvent.PAUSED :
          setPlayState( false );
          break;
        case MediaEvent.STOPPED :
          updateTimer.stop();
          progressTimer.stop();
          break;
        case MediaEvent.META :
          volumeBar.setValue(components.mediaPlayer.getVolume());
          updatePlayTime();
          break;
      }
    }

    private function onMediaUpdate( event:TimerEvent ):void {
      updatePlayTime();
    }

    private function onMediaProgress( event:TimerEvent ):void {
      var bLoaded:Number=components.mediaPlayer.getMediaBytesLoaded();
      var bTotal:Number=components.mediaPlayer.getMediaBytesTotal();
      var pLoaded:Number = bTotal ? (bLoaded / bTotal) : 0;
      if (pLoaded<1) {
        setPercentLoaded( pLoaded );
      } else {
        setPercentLoaded( 1 );
        progressTimer.stop();
      }
    }

    public function onSeek( event:ControlEvent ):void {
      components.mediaPlayer.seekMedia( totalTime * seekBar.value );
    }

    public function onVolume( event:ControlEvent ):void {
      currentVolume=volumeBar.value;
      setMuteState( false );
      components.mediaPlayer.setVolume( currentVolume );
    }

    public function onMute( event:MouseEvent ):void {
      setMuteState( !muteState );
      var newVolume:Number = (muteState ? 0 : currentVolume);
      if (volumeBar) {
        volumeBar.setPosition( newVolume );
      }
      components.mediaPlayer.setVolume( newVolume );
    }

    public function onPlayPause( event:MouseEvent ):void {
      setPlayState( !playState );
      if (playState) {
        components.mediaPlayer.playMedia();
      } else {
        components.mediaPlayer.pauseMedia();
      }
    }

    public function onToggleFullScreen( event:MouseEvent ):void {
      var on:Boolean = (stage.displayState == StageDisplayState.FULL_SCREEN);
      stage.displayState=on?StageDisplayState.NORMAL:StageDisplayState.FULL_SCREEN;
    }

    public function onMenu( event:MouseEvent ):void {
      dispatchEvent( new ControlEvent( ControlEvent.MENU ) );
    }

    public function setVolume( vol:Number ):void {
      currentVolume=vol;
      if (volumeBar) {
        volumeBar.setPosition( vol );
      }
    }

    private function updatePlayTime():void {
      totalTime=components.mediaPlayer.getDuration();
      var currentTime:Number=components.mediaPlayer.getCurrentTime();

      if (skin.formatTime is Function) {
        if (playTime) {
          playTime.text=skin.formatTime(currentTime).time;
        }

        if (duration) {
          duration.text=skin.formatTime(totalTime).time;
        }
      }

      if (seekBar&&totalTime&&! seekBar.dragging) {
        seekBar.updateValue( currentTime / totalTime );
      }
    }

    public function setPercentLoaded( percent:Number ):void {
      if (seekBar&&seekBar.skin.progress) {
        seekBar.skin.progress.width = (seekBar.track.width * percent);
      }
    }

    public function setPlayState( newState:Boolean ):void {
      if (playPauseButton) {
        playPauseButton.onButton.visible=! newState;
        playPauseButton.offButton.visible=newState;
        playState=newState;
      }
    }

    public function setMuteState( newState:Boolean ):void {
      if (mute) {
        mute.onButton.visible=newState;
        mute.offButton.visible=! newState;
        muteState=newState;
      }
    }

    public var mute:MovieClip;
    public var volumeBar:Slider;
    public var seekBar:Slider;
    public var playPauseButton:MovieClip;
    public var playTime:TextField;
    public var duration:TextField;
    public var toggleFullScreen:MovieClip;
    public var menuButton:MovieClip;

    public var playState:Boolean;
    public var muteState:Boolean;
    public var updateTimer:Timer;
    public var progressTimer:Timer;
    public var currentVolume:Number=1;
    public var totalTime:Number=0;
  }
}