var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var game = {
  resources: gameSettings.resources,
  player: null,
  shots: [],
  enemies: [],
  booms: [],
  keysPressed: [],
  // hash, values are functions
  operations: {},
  canvas: null,
  context: null,
  background: null,
  rootEl: null,
  // mode: [startScreen, gameOverScreen, play, ]
  stats: { score: 0, wave: 0, mode: 'startScreen' }
};

var loader = new ResourcesLoader(game.resources), gameDirector = new GameDirector(game);

var render = function(){
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  for(var i in game.shots){ game.shots[i].render(game.context) };
  for(var i in game.enemies){ game.enemies[i].render(game.context) };
  for(var i in game.booms){ game.booms[i].render(game.context) };
  if (game.player) game.player.render(game.context);
  for(var i in game.operations) { game.operations[i].call(game.context, game) }
};

var filterArrays = function(){
  for(var i = game.shots.length - 1; i >= 0; i--){ if (game.shots[i].outOnTop(gameDirector.getBox())) game.shots.splice(i, 1) }
  for(var i = game.enemies.length - 1; i >=0; i--){ if (game.enemies[i].outOnBottom(gameDirector.getBox())) game.enemies.splice(i, 1) }
  for(var i = game.booms.length - 1; i >= 0; i--){ if (game.booms[i].canBeRemoved()) game.booms.splice(i, 1) }
};

var calculateCollisions = function(){
  for (var i = game.enemies.length - 1; i >= 0; i--) {
    var enemy = game.enemies[i];
    if (enemy && game.player && helper.collide(enemy, game.player)) {
      var boom = game.resources.boom;
      game.booms.push(new Sprite(enemy.x + enemy.frameWidth / 2 - boom.frameWidth / 2, enemy.y + enemy.frameHeight - boom.frameHeight, boom, 5));
      game.enemies.splice(j, 1);
      game.player = null;
      game.stats.mode = 'gameOverScreen';
      break;
    }
  }

  for(var i = game.shots.length - 1; i >= 0; i--){
    var shot = game.shots[i];
    for (var j = game.enemies.length - 1; j >= 0; j--) {
      var enemy = game.enemies[j];
      if (shot && enemy && helper.collide(shot, enemy)) {
        var boom = game.resources.boom;
        game.booms.push(new Sprite(enemy.x + enemy.frameWidth / 2 - boom.frameWidth / 2, enemy.y + enemy.frameHeight - boom.frameHeight, boom, 2));
        game.shots.splice(i, 1);
        game.enemies.splice(j, 1);
        game.stats.score += 1;
        break;
      }
    }
  }


};

var update = function(){
  if (game.player){
    for(var i in game.keysPressed){ var key = game.keysPressed[i]; game.player.increment(key.coord, key.speed) }
  }
  for(var i in game.shots){ var shot = game.shots[i]; shot.increment(shot.coord, shot.speed) }
  for(var i in game.enemies){ var enemy = game.enemies[i]; enemy.increment(enemy.coord, enemy.speed) }
  if (game.player) { game.player.setToBox(gameDirector.getBox()); }
};

var lastTime;

var main = function(){
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  filterArrays();
  calculateCollisions();
  update();
  render();
  lastTime = now;
  requestAnimationFrame(main);
};

var maxWidth = 600, maxHeight = 600;

var setCanvas = function(){
  var dw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var dh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var width = dw > maxWidth ? maxWidth : dw;
  var height = dh > maxHeight ? maxHeight : dh;
  if (game.canvas) {
    game.rootEl.style.width = width + 'px';
    game.rootEl.style.height = height + 'px';
    game.background.width = width;
    game.background.height = height;
    game.canvas.width = width;
    game.canvas.height = height;
    game.context = game.canvas.getContext('2d');
  }
};

var initialize = function(){
  game.rootEl = document.createElement('div');
  game.rootEl.id = 'root_el';
  game.background = document.createElement('canvas');
  game.background.id = 'background';
  game.canvas = document.createElement('canvas');
  game.canvas.id = 'game';
  document.body.insertBefore(game.rootEl, document.body.childNodes[0]);
  game.rootEl.insertBefore(game.background, game.rootEl.childNodes[0]);
  game.rootEl.insertBefore(game.canvas, game.rootEl.childNodes[0]);

  game.context = game.canvas.getContext('2d');
  setCanvas();
  gameDirector.setLoading();
  main();

  loader.load(function(){ new GameDirector(game).run() });

};
