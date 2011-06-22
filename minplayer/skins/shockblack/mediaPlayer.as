function initialize( mediaPlayer:* )
{
  backgroundMC.width = mediaPlayer.stage.stageWidth;
  backgroundMC.height = mediaPlayer.stage.stageHeight;
}

function onResize( deltaX:Number, deltaY:Number ) : void
{
  backgroundMC.width = backgroundMC.width + deltaX;
  backgroundMC.height = backgroundMC.height + deltaY;

  // Now resize the preview.
  preview.resize( backgroundMC.getRect(this) );
}