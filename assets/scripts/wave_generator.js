var WaveGenerator = function(enemyResources, speed){
  this.enemies = enemyResources;
  this.speed = speed || 1;
};

WaveGenerator.prototype.generate = function(outputArray, box, count){
  var fullHeight = null;
  
  for (var i = 0; i < count; i++){
	var resource = this.enemies[helper.random(this.enemies.length)];
	if (!fullHeight){ fullHeight = resource.frameHeight }
	var sprite = new Sprite(helper.random(box.frameWidth - resource.frameWidth), - fullHeight - 20 - helper.random(20), resource);
	sprite.speed = this.speed;
	sprite.coord = 'y'
	outputArray.push(sprite);
	fullHeight += resource.frameHeight;
  }
}

window.WaveGenerator = WaveGenerator;