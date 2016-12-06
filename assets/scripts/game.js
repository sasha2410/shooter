var globalSpeed = 6;

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;  

var resources = { 
  helicopter: { 
    url: 'assets/models/hcopter.png', 
    framesCount: 3, 
    frameWidth: 20, 
    frameHeight: 38,
    cachedImage: null 
  },
  ship: { 
    url: 'assets/models/spaceship.png', 
    framesCount: 4, 
    frameWidth: 100, 
    frameHeight: 150,
    cachedImage: null 
  },
  shot: { 
    url: 'assets/models/shot.png', 
    framesCount: 1, 
    frameWidth: 43, 
    frameHeight: 74,
    cachedImage: null 
  }
};
var player = {};
var shots = [];
var objects = [];
var keysPressed = {};

var canvas, context, loader = new ResourcesLoader(resources);


var render = function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (loader.loaded){
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
	for(var i in shots){ shots[i].render(context); }
    for(var i in objects){ objects[i].render(context); }
	player.render(context);
  }
  else
  {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#ffffff';
    context.font = "30px Verdana";
    context.strokeText("Loading...", canvas.width / 2 - (15*10 / 2), canvas.height / 2 - 15)
  }
};

var update = function(dt){
  for(var i in keysPressed){ player.increment(keysPressed[i].coord, keysPressed[i].speed); }
  for(var i in shots){ shots[i].increment(shots[i].coord, shots[i].speed); }
  for(var i in objects){ objects[i].increment(objects[i].coord, objects[i].speed); }
};

var lastTime;

var main = function(){
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  
  update(dt);
 
  render();
  
  lastTime = now;
  requestAnimationFrame(main);
};

var addEvents = function(){
  document.addEventListener('keydown', function(ev){
	ev.preventDefault();
	switch (ev.keyCode.toString()){
	  case '37':
	    // left
		keysPressed[ev.keyCode] = { speed: -globalSpeed, coord: 'x' };
		break;
	  case '38':
        // up
		keysPressed[ev.keyCode] = { speed: -globalSpeed, coord: 'y' };
		break;
      case '39':
        // right	
        keysPressed[ev.keyCode] = { speed: globalSpeed, coord: 'x' };
		break;
      case '40':
        //down	
        keysPressed[ev.keyCode] = { speed: globalSpeed, coord: 'y' };	
		break;
      case '32':
        //space
        shot(player);		
	}
  });
  document.addEventListener('keyup', function(ev){
	delete keysPressed[ev.keyCode];
	if (!Object.keys(keysPressed).length) player.moves = [];   
  });	
};

var shot = function(parent){
  var sprite = new Sprite(parent.x + parent.frameWidth / 2 - resources.shot.frameWidth / 2, parent.y, resources.shot);
  sprite.speed = -(globalSpeed * (1.8 + Math.random(5) / 10) );
  sprite.coord = 'y'
  shots.push(sprite);
}

var initialize = function(){
  canvas = document.getElementById('game');
  context = canvas.getContext('2d');
  loader.load(function(){
    player = new Sprite(canvas.width / 2 - resources.ship.frameWidth / 2, canvas.height - resources.ship.frameHeight, resources.ship);
	addEvents();
  });
  main();
};
