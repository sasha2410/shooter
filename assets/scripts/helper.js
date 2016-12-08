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
  
  runWithDelay: function(func, delay, condition){	  
	if (typeof(condition) == 'undefined') condition = true;
	if (delay > 0 && condition){
      var intId = setInterval(function(){
        clearInterval(intId);
        func();
      }, delay);
    }
    else func();
  },

  outOnTop: function(sprite, box){
    return (sprite.y + sprite.frameHeight < box.y);
  },

  outOnBottom: function(sprite, box){
    return (sprite.y > box.y + box.frameHeight)
  },

  prepareOffsets: function(ev) {
    if (ev.offsetX || !ev.touches) return;
	var rect = ev.touches[0].target.getBoundingClientRect();
    ev.offsetX = ev.touches[0].pageX - rect.left;
    ev.offsetY = ev.touches[0].pageY - rect.top;
  },
  
  ios: function(){
	return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;   
  },

  random: function(max, min){
    if (!min){ min = 0 }
    return Math.floor(Math.random() * (max - min)) + min;
  }
};