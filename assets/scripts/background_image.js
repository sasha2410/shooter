var BackgroundImage = function (box, resources){
  this.box = box;
  this.resources = resources;
  this.selectedResource = null;
  this.shuffle();
};

BackgroundImage.prototype.shuffle = function(){
  this.selectedResource = this.resources[Math.floor(Math.random() * this.resources.length)];
};

BackgroundImage.prototype.render = function(context){
  var left = - ((this.selectedResource.frameWidth - this.box.frameWidth) / 2);
  var top = - ((this.selectedResource.frameHeight - this.box.frameHeight) / 2);
  context.drawImage(this.selectedResource.cachedImage, left, top, this.selectedResource.frameWidth, this.selectedResource.frameHeight);
};

window.BackgroundImage = BackgroundImage;