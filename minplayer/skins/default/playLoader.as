function initialize( playLoader:* )
{
  backgroundMC.width = playLoader.stage.stageWidth;
  backgroundMC.height = playLoader.stage.stageHeight;

  // Set the x position to the middle of the stage.
  playButton.x = (playLoader.stage.stageWidth - playButton.width) / 2;
  playButton.y = (playLoader.stage.stageHeight - playButton.height) / 2;

  loader.x = (playLoader.stage.stageWidth - loader.width) / 2;
  loader.y = (playLoader.stage.stageHeight - loader.height) / 2;
}

function onResize( deltaX:Number, deltaY:Number ) : void
{
  backgroundMC.width = backgroundMC.width + deltaX;
  backgroundMC.height = backgroundMC.height + deltaY;

  playButton.x = playButton.x + (deltaX / 2);
  playButton.y = playButton.y + (deltaY / 2);

  loader.x = loader.x + (deltaX / 2);
  loader.y = loader.y + (deltaY / 2);
}