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
  this[attr] += by;
}

Sprite.prototype.setToBox = function(box){
  if (this.x < box.x) this.x = box.x;
  if (this.y < box.y) this.y = box.y;
  if (this.x + this.frameWidth > box.width) this.x = box.width - this.frameWidth;
  if (this.y + this.frameHeight > box.height) this.y = box.height - this.frameHeight;
}

Sprite.prototype.render = function(context){
  context.drawImage(this.image, this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
  if (Math.random() < 0.6) {
    this.currentFrame = this.currentFrame == this.framesCount - 1 ? 0 : this.currentFrame + 1;
  }
};

window.Sprite = Sprite;