var Sprite = function (x, y, resource, drawRepeat){
  this.x = x;
  this.y = y;
  this.framesCount = resource.framesCount;
  this.frameWidth = resource.frameWidth;
  this.frameHeight = resource.frameHeight;
  this.currentFrame = 0;
  this.fullCycleCount = 0;
  this.image = resource.cachedImage;
  this.drawRepeat = typeof(drawRepeat) == 'undefined' ? -1 : drawRepeat;
};
 
Sprite.prototype.increment = function(coord, by){
  var attr = coord == 'x' ? 'x' : 'y';
  this[attr] += by;
};

Sprite.prototype.outsideOfBox = function(box){ return !helper.collide(box, this) };

Sprite.prototype.outOnTop = function(box){ return helper.outOnTop(this, box) };

Sprite.prototype.outOnBottom = function(box){ return helper.outOnBottom(this, box) };

Sprite.prototype.canBeRemoved = function(){ 
  return (this.drawRepeat > 0 && this.fullCycleCount == this.drawRepeat ) 
};

Sprite.prototype.setToBox = function(box){
  if (this.x < box.x) this.x = box.x;
  if (this.y < box.y) this.y = box.y;
  if (this.x + this.frameWidth > box.frameWidth) this.x = box.frameWidth - this.frameWidth;
  if (this.y + this.frameHeight > box.frameHeight) this.y = box.frameHeight - this.frameHeight;
};

Sprite.prototype.fire = function(shotResource, side){
  if (!shotResource){ shotResource = gameSettings.resources.playerShot }
  if (!side){ side = 'top' }

  var x = 0, y = 0, 
      speed = gameSettings.globalSpeed * (1.8 + Math.random(5) / 10), 
      coord = null;

  switch(side){
    case 'top':
      x = this.x + this.frameWidth / 2 - shotResource.frameWidth / 2;
      y = this.y;
      speed = -speed;
      coord = 'y';
      break;
    case 'bottom':
      x = this.x + this.frameWidth / 2 - shotResource.frameWidth / 2;
      y = this.y + this.frameHeight;  
      coord = 'y';
  };
  
  var shotSprite = new Sprite(x, y, shotResource);
  shotSprite.speed = speed;
  shotSprite.coord = coord;

  return shotSprite;
}

Sprite.prototype.render = function(context){
  context.drawImage(this.image, this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
  if (Math.random() < 0.6) {
    this.currentFrame = this.currentFrame == this.framesCount - 1 ? 0 : this.currentFrame + 1;
    if (this.currentFrame == 0 && this.drawRepeat > 0){ this.fullCycleCount += 1}
  }
};

window.Sprite = Sprite;