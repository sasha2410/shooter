var WaveGenerator = function(enemyResources){
  this.enemies = enemyResources;
};

WaveGenerator.prototype.generate = function(outputArray, box, count, speed){
  var fullHeight = null;
	speed = speed || 1;
  
  for (var i = 0; i < count; i++){
	var resource = this.enemies[helper.random(this.enemies.length)];
	if (!fullHeight){ fullHeight = resource.frameHeight }
	var sprite = new Sprite(helper.random(box.frameWidth - resource.frameWidth), - fullHeight, resource);
	sprite.speed = speed;
	sprite.coord = 'y';
	outputArray.push(sprite);
	fullHeight += resource.frameHeight * 1.5 - helper.random(20);
  }
};

window.WaveGenerator = WaveGenerator;