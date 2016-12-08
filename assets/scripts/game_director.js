var loading = function(game){
  this.fillStyle = '#000000';
  this.fillRect(0, 0, game.canvas.width, game.canvas.height);
  this.strokeStyle = '#ffffff';
  this.font = "30px Verdana";
  this.strokeText("Loading...", game.canvas.width / 2 - (15*10 / 2), game.canvas.height / 2 - 15)
};

var renderScore = function(game){
  this.save();
  this.globalAlpha = 0.8;
  this.fillStyle = '#000000';
  this.fillRect(0, 0, game.canvas.width, 30);
  this.globalAlpha = 1;
  this.strokeStyle = '#ffffff';
  this.font = "14px Verdana";
  this.strokeText("Score : " + game.stats.score, 0, 15);
  var waveText = "Wave Number : " + game.stats.wave;
  this.strokeText(waveText, game.canvas.width - (waveText.length * 14), 15);
  this.restore();
};

var renderPrepare = function(game){
  this.save();
  game.context.fillStyle = '#000000';
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
  game.context.strokeStyle = '#ffffff';
  game.context.font = "30px Verdana";
  var text = "Prepare to wave " + game.stats.wave + "... ( " + game.stats.counter + " )";
  game.context.strokeText(text, game.canvas.width / 2 - (15 * text.length / 2), game.canvas.height / 2 - 15)
  this.restore();
};


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
        game.shots.push(new Shot(game.player, game.resources.playerShot, 'top').shotSprite);
    }
  });
  document.addEventListener('keyup', function(ev){
    delete game.keysPressed[ev.keyCode];
  });
};

GameDirector.prototype.setLoading = function(){
  this.game.operations.loading = loading;
};

GameDirector.prototype.initWave = function(timeToWait){
  var _this = this;
  this.busyWave = true;
  game.stats.counter = timeToWait;
  this.game.operations = { renderPrepare: renderPrepare };
  var intId = setInterval(function(){
    if (_this.game.stats.counter == 0){
      clearInterval(intId);
      delete _this.game.operations.renderPrepare;
      delete _this.game.stats.counter;
      _this.game.operations.renderScore = renderScore;
      _this.waveGenerator.generate(_this.game.enemies, _this.getBox(), 10, gameSettings.globalSpeed * 0.5);
      _this.busyWave = false;
    }
    else _this.game.stats.counter -= 1;
  }, 1000);
};

GameDirector.prototype.run = function(){
  var lastTime = Date.now();
  var dt = (Date.now() - lastTime) / 1000.0;

  this.addEvents();
  delete this.game.operations.loading;
  var _this = this;
  var intId = setInterval(function(){
    if (!_this.busyWave && !_this.game.enemies.length){
      _this.game.stats.wave += 1;
      _this.initWave(5)
    }
  }, 100);
};

window.GameDirector = GameDirector;