var GameDirector = function(game){
  this.game = game;
  this.busyWave = false;
  this.waveGenerator = new WaveGenerator([
    this.game.resources.enemyShip1,
    this.game.resources.enemyShip2,
    this.game.resources.enemyShip3
  ]);
};

GameDirector.prototype.getBox = function(){ return { x: 0, y: 0, frameWidth: this.game.canvas.width, frameHeight: this.game.canvas.height } };

GameDirector.prototype.addEvents = function(){
  var _this = this;

  this.game.canvas.addEventListener('mousedown', function(ev){
    helper.prepareOffsets(ev);

    for(var i in screens.buttons){
      var point = { x: ev.offsetX, y: ev.offsetY, frameWidth: 1, frameHeight: 1 };
      var button = screens.buttons[i];
      if (helper.collide(point, button)){ _this[button.action]() }
    }
  });

  document.addEventListener('keydown', function(ev){
    ev.preventDefault();
    switch (ev.keyCode.toString()){
      case '37':
        // left
        game.keysPressed[ev.keyCode] = { speed: -gameSettings.globalSpeed, coord: 'x' };
        break;
      case '38':
        // up
        game.keysPressed[ev.keyCode] = { speed: -gameSettings.globalSpeed, coord: 'y' };
        break;
      case '39':
        // right
        game.keysPressed[ev.keyCode] = { speed: gameSettings.globalSpeed, coord: 'x' };
        break;
      case '40':
        //down
        game.keysPressed[ev.keyCode] = { speed: gameSettings.globalSpeed, coord: 'y' };
        break;
      case '32':
        //space
        if (game.player) game.shots.push(fire(game.player, game.resources.playerShot, 'top'));
    }
  });
  document.addEventListener('keyup', function(ev){
    delete game.keysPressed[ev.keyCode];
  });
};

GameDirector.prototype.setLoading = function(){
  this.game.operations.loading = screens.loading;
};

GameDirector.prototype.setBackground = function(resource){
  this.game.background.getContext('2d').drawImage(resource.cachedImage, 0, 0, game.canvas.width, game.canvas.height, 0, 0, game.canvas.width, game.canvas.height);
};

GameDirector.prototype.setPlayer = function(resource){
  this.game.player = new Sprite(this.game.canvas.width / 2 - resource.frameWidth / 2, game.canvas.height - resource.frameHeight, resource);
};

GameDirector.prototype.initGame = function(){
  this.stopWave();
  this.setBackground(this.game.resources.background);
  this.setPlayer(this.game.resources.playerShip);
  this.game.shots = [];
  this.game.enemies = [];
  this.game.booms = [];
  this.game.keysPressed = [];
  this.game.stats.wave = 0;
  this.game.stats.score = 0;
  this.game.operations = {};
  this.busyWave = false;
  this.game.stats.mode = 'play';
};

GameDirector.prototype.stopWave = function(){
  if (this.waveId) { clearInterval(this.waveId) }
};

GameDirector.prototype.initWave = function(timeToWait){
  var _this = this;
  this.game.stats.counter = timeToWait;
  this.game.operations = { renderPrepare: screens.renderPrepare };
  this.stopWave();
  this.waveId = setInterval(function(){
    if (_this.game.stats.counter > 1) _this.game.stats.counter -= 1;
    else {
      _this.stopWave();
      delete _this.game.operations.renderPrepare;
      delete _this.game.stats.counter;
      _this.game.operations.renderScore = screens.renderScore;
      _this.waveGenerator.generate(_this.game.enemies, _this.getBox(), 10, gameSettings.globalSpeed * 0.5);
      _this.busyWave = false;
      _this.game.stats.wave += 1;
    }
  }, 1000);
};

GameDirector.prototype.gameHandler = function(){
  var _this = this;

  if (this.game.stats.mode == 'play' && !this.busyWave && !this.game.enemies.length){
    this.busyWave = true;
    if (this.game.stats.wave > 0){
      var intId = setInterval(function(){
        clearInterval(intId);
        _this.initWave(3);
      }, 1000);
    }
    else this.initWave(3);
  }
  else if (!this.busyWave && this.game.stats.mode == 'startScreen') {
    this.game.operations = { startScreen: screens.startScreen };
  }
  else if (!this.busyWave && this.game.stats.mode == 'gameOverScreen'){
    this.busyWave = true;
    var intId = setInterval(function(){
      clearInterval(intId);
      this.game.operations = { gameOverScreen: screens.gameOverScreen };
    }, 2000);
  }
};

GameDirector.prototype.run = function(){
  this.addEvents();
  this.game.operations = {};
  this.game.stats.mode = 'startScreen';

  var _this = this;
  setInterval(function(){ _this.gameHandler() }, 100);
};

window.GameDirector = GameDirector;