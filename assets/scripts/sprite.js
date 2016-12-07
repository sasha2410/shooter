var Sprite = function (x, y, resource, drawRepeat){
  this.x = x;
  this.y = y;
  this.framesCount = resource.framesCount;
  this.frameWidth = resource.frameWidth;
  this.frameHeight = resource.frameHeight;
  this.currentFrame = 0;
  this.image = resource.cachedImage;
  this.drawRepeat = typeof(drawRepeat) == 'undefined' ? true : drawRepeat;
};
 
Sprite.prototype.increment = function(coord, by){
  var attr = coord == 'x' ? 'x' : 'y';
  this[attr] += by;
};

Sprite.prototype.outsideOfBox = function(box){ return !helper.collide(box, this) }

Sprite.prototype.canBeRemoved = function(){ return (!this.drawRepeat && this.currentFrame == this.framesCount - 1) }

Sprite.prototype.setToBox = function(box){
  if (this.x < box.x) this.x = box.x;
  if (this.y < box.y) this.y = box.y;
  if (this.x + this.frameWidth > box.frameWidth) this.x = box.frameWidth - this.frameWidth;
  if (this.y + this.frameHeight > box.frameHeight) this.y = box.frameHeight - this.frameHeight;
};

Sprite.prototype.render = function(context){
  context.drawImage(this.image, this.currentFrame * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
  if (Math.random() < 0.6) {
    this.currentFrame = this.currentFrame == this.framesCount - 1 ? 0 : this.currentFrame + 1;
  }
};

window.Sprite = Sprite;