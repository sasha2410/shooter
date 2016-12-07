var Shot = function(parentSprite, shotResource, side){
  var x = 0, y = 0, 
      speed = gameSettings.globalSpeed * (1.8 + Math.random(5) / 10), 
      coord = null;
      
  this.parentSprite = parentSprite;
  this.shotResource = shotResource;
  
  switch(side){
    case 'top':
      x = parentSprite.x + parentSprite.frameWidth / 2 - shotResource.frameWidth / 2;
      y = parentSprite.y;
      speed = -speed;
      coord: 'y';
      break;
    case 'bottom':
      x = parentSprite.x + parentSprite.frameWidth / 2 - shotResource.frameWidth / 2;
      y = parentSprite.y + parentSprite.frameHeight;  
      coord: 'y';
  }
  
  this.shotSprite = new Sprite(x, y, shotResource);
  this.shotSprite.speed = speed;
  this.shotSprite.coord = coord;
}

window.Shot = Shot;