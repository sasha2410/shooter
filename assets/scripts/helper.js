window.helper = {
   collide: function (sprite1, sprite2) {
	var sprite1Right = sprite1.x + sprite1.frameWidth,
	    sprite1Bottom = sprite1.y + sprite1.frameHeight,
		sprite2Right = sprite2.x + sprite2.frameWidth,
	    sprite2Bottom = sprite2.y + sprite2.frameHeight;   
	   
    return !(
      sprite1.y > sprite2Bottom ||
      sprite1Right < sprite2.x ||
      sprite1Bottom < sprite2.y ||
      sprite1.x > sprite2Right
    );
  },
  
  random: function(max, min){
	if (!min){ min = 0 }
	return Math.floor(Math.random() * (max - min)) + min;
  }
}