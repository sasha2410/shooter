var Sprite = function (x, y, resource){
  this.x = x;
  this.y = y;
  this.framesCount = resource.framesCount;
  this.frameWidth = resource.frameWidth;
  this.frameHeight = resource.frameHeight;
  this.currentFrame = 0;
  this.image = resource.cachedImage;
};
 
Sprite.prototype.increment = function(coord, by){
  var attr = coord == 'x' ? 'x' : 'y';
  this[attr] = by;
}

Sprite.prototype.render = function(context){
  context.drawImage(this.image, this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
  this.currentFrame = this.currentFrame == this.framesCount - 1 ? 0 : this.currentFrame + 1;
};

window.Sprite = Sprite;