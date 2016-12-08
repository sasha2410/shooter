var fire = function(parentSprite, shotResource, side){
  var x = 0, y = 0, 
      speed = gameSettings.globalSpeed * (1.8 + Math.random(5) / 10), 
      coord = null;

  switch(side){
    case 'top':
      x = parentSprite.x + parentSprite.frameWidth / 2 - shotResource.frameWidth / 2;
      y = parentSprite.y;
      speed = -speed;
      coord = 'y';
      break;
    case 'bottom':
      x = parentSprite.x + parentSprite.frameWidth / 2 - shotResource.frameWidth / 2;
      y = parentSprite.y + parentSprite.frameHeight;  
      coord = 'y';
  };
  
  var shotSprite = new Sprite(x, y, shotResource);
  shotSprite.speed = speed;
  shotSprite.coord = coord;

  return shotSprite;
};

window.fire = fire;