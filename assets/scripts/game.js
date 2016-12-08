var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;  
var gameStats = {
  score: 0,
  waveNumber: 0
};

var resources = gameSettings.resources;
var player = null;
var shots = [];
var enemies = [];
var booms = [];
var keysPressed = {};

var rootEl, background, canvas, context, loader = new ResourcesLoader(resources),
    waveGenerator = new WaveGenerator([resources.enemyShip1, resources.enemyShip2, resources.enemyShip3], gameSettings.globalSpeed * 0.5);

var render = function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (loader.loaded){
    for(var i in shots){ shots[i].render(context); }
    for(var i in enemies){ enemies[i].render(context); }
    for(var i in booms){ booms[i].render(context); }
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

var getBox = function(){ return { x: 0, y: 0, frameWidth: canvas.width, frameHeight: canvas.height } };

var filterArrays = function(){
  for(var i = shots.length - 1; i >= 0; i--){ if (shots[i].outsideOfBox(getBox())) shots.splice(i, 1) }
  for(var i = booms.length - 1; i >= 0; i--){ if (booms[i].canBeRemoved()) booms.splice(i, 1) }  
};

var calculateCollisions = function(){
  for(var i = shots.length - 1; i >= 0; i--){
    var shot = shots[i];
    for (var j = enemies.length - 1; j >= 0; j--) {
      var enemy = enemies[j];
      if (shot && enemy && helper.collide(shot, enemy)) {
        var boom = resources.boom;
        booms.push(new Sprite(enemy.x + enemy.frameWidth / 2 - boom.frameWidth / 2, enemy.y + enemy.frameHeight - boom.frameHeight, boom, false));
        shots.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }
};

var update = function(dt){
  for(var i in keysPressed){ player.increment(keysPressed[i].coord, keysPressed[i].speed) }
  for(var i in shots){ shots[i].increment(shots[i].coord, shots[i].speed) }
  for(var i in enemies){ enemies[i].increment(enemies[i].coord, enemies[i].speed) }
  if (player) { player.setToBox(getBox()); }
};

var lastTime;

var main = function(){
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  
  filterArrays();
  calculateCollisions();
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
		keysPressed[ev.keyCode] = { speed: -gameSettings.globalSpeed, coord: 'x' };
		break;
	  case '38':
        // up
		keysPressed[ev.keyCode] = { speed: -gameSettings.globalSpeed, coord: 'y' };
		break;
      case '39':
        // right	
        keysPressed[ev.keyCode] = { speed: gameSettings.globalSpeed, coord: 'x' };
		break;
      case '40':
        //down	
        keysPressed[ev.keyCode] = { speed: gameSettings.globalSpeed, coord: 'y' };	
		break;
      case '32':
        //space
        shots.push(new Shot(player, resources.playerShot, 'top').shotSprite);		
	}
  });
  document.addEventListener('keyup', function(ev){
	delete keysPressed[ev.keyCode];
	if (!Object.keys(keysPressed).length) player.moves = [];   
  });	
};

var width = 320, height = 568;

var setCanvas = function(){
  //var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  //var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (canvas) {
    rootEl.style.width = width + 'px';
    rootEl.style.height = height + 'px';
    background.width = width;
    background.height = height;
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
  }
};

var setBackground = function(){
  background.getContext('2d').drawImage(resources.background.cachedImage, 0, 0, width, height, 0, 0, width, height);
};

var initialize = function(){
  rootEl = document.createElement('div');
  rootEl.id = 'root_el';
  background = document.createElement('canvas');
  background.id = 'background';
  canvas = document.createElement('canvas');
  canvas.id = 'game';
  document.body.insertBefore(rootEl, document.body.childNodes[0]);
  rootEl.insertBefore(background, rootEl.childNodes[0]);
  rootEl.insertBefore(canvas, rootEl.childNodes[0]);

  context = canvas.getContext('2d');
  setCanvas();

  //window.onresize = function(){ setCanvas() };
  loader.load(function(){
    var item = resources.playerShip;
    setBackground();
    player = new Sprite(canvas.width / 2 - item.frameWidth / 2, canvas.height - item.frameHeight, item);
	  addEvents();
	  waveGenerator.generate(enemies, getBox(), 10);
  });
  main();
};
