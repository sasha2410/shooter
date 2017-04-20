var GameDirector = function(game){
  this.game = game;
  this.backgroundResource = game.resources.background;
  this.playerResource = game.resources.playerShip;
  this.busyWave = false;
  this.waveGenerator = new WaveGenerator([
    this.game.resources.enemyShip1,
    this.game.resources.enemyShip2,
    this.game.resources.enemyShip3
  ]);
};

GameDirector.prototype.getBox = function(){ return { x: 0, y: 0, frameWidth: this.game.canvas.width, frameHeight: this.game.canvas.height - screens.fireButtonHeight } };

GameDirector.prototype.playerFire = function(){
  if (this.game.player) this.game.shots.push(this.game.player.fire());
};

var buttonHandler = function(ev){
    helper.prepareOffsets(ev);

    for(var i in screens.buttons){
      var point = { x: ev.offsetX, y: ev.offsetY, frameWidth: 1, frameHeight: 1 };
      var button = screens.buttons[i];
      if (helper.collide(point, button)){ this[button.action]() }
    }
  };

GameDirector.prototype.addEvents = function(){
  var _this = this;

  this.game.canvas.addEventListener('mousedown', function(ev){ buttonHandler.call(_this, ev) });  

  document.addEventListener('keydown', function(ev){
    ev.preventDefault();
    switch (ev.keyCode.toString()){
      case '37':
        // left
        _this.game.keysPressed[ev.keyCode] = { speed: -gameSettings.globalSpeed, coord: 'x' };
        break;
      case '38':
        // up
        _this.game.keysPressed[ev.keyCode] = { speed: -gameSettings.globalSpeed, coord: 'y' };
        break;
      case '39':
        // right
        _this.game.keysPressed[ev.keyCode] = { speed: gameSettings.globalSpeed, coord: 'x' };
        break;
      case '40':
        //down
        _this.game.keysPressed[ev.keyCode] = { speed: gameSettings.globalSpeed, coord: 'y' };
        break;
      case '32':
        //space
		_this.playerFire();
    }
  });
  document.addEventListener('keyup', function(ev){
    delete game.keysPressed[ev.keyCode];
  });
  
  

};

GameDirector.prototype.addTouchEvents = function(){
  // touch events
  var _this = this;
  
  var touchStart = function(ev){
    ev.preventDefault();
    helper.prepareOffsets(ev);
    var player = _this.game.player;
    if (!player) return;
    var playerCenter = player.getCenter(),
        playerX = playerCenter.x,
        playerY = playerCenter.y;

    if (ev.offsetY >= _this.game.canvas.height - screens.fireButtonHeight) return;

    var angle = Math.atan2(ev.offsetY - playerY, ev.offsetX - playerX) * 180 / Math.PI;
    var sign = angle < 0 ? -1 : 1;
    var quarter = Math.floor(Math.abs(angle / 90)) + 1;
    var quarterAngle = Math.abs(angle) - (quarter - 1) * 90;
    var speedX, speedY;
    switch(quarter){
      case 1:
        speedY = quarterAngle / 90 * sign;
        speedX = (1 - Math.abs(speedY));
        break;
      case 2:
        speedX = quarterAngle / 90 * -1;
        speedY = (1 - Math.abs(speedX)) * sign;
        break;
    }

    var restriction = function(){
      var player = _this.game.player;
      if (!player) return;
      var playerCenter = player.getCenter();
      var xOut = (speedX > 0) ? playerCenter.x >= ev.offsetX : playerCenter.x <= ev.offsetX;
      var yOut = (speedY > 0) ? playerCenter.y >= ev.offsetY : playerCenter.y <= ev.offsetY;
      if (xOut || yOut) {
        player.moveTo(ev.offsetX, ev.offsetY);
        delete _this.game.keysPressed['touchX'];
        delete _this.game.keysPressed['touchY'];
      }
    };

    this.game.keysPressed.touchX = { speed: gameSettings.globalSpeed * speedX, coord: 'x', callback: restriction };
    this.game.keysPressed.touchY = { speed: gameSettings.globalSpeed * speedY, coord: 'y', callback: restriction };
  };
  
  var touchEnd = function(ev){
    ev.preventDefault();
    delete this.game.keysPressed['touchX'];
    delete this.game.keysPressed['touchY'];
  };

  this.game.canvas.addEventListener('touchstart', function(ev){ 
    touchStart.call(_this, ev);
    buttonHandler.call(_this, ev);
  });
  this.game.canvas.addEventListener('touchend', function(ev){ touchEnd.call(_this, ev) });
  this.game.canvas.addEventListener('mousedown', function(ev){ touchStart.call(_this, ev); });
  this.game.canvas.addEventListener('mouseup', function(ev){ touchEnd.call(_this, ev) });
};

GameDirector.prototype.setLoading = function(){
  this.game.operations.loading = screens.loading;
};

GameDirector.prototype.setBackground = function(){
  var r = this.backgroundResource;
  this.game.background.getContext('2d').drawImage(r.cachedImage, 0, 0, game.canvas.width, game.canvas.height, 0, 0, game.canvas.width, game.canvas.height);
};

GameDirector.prototype.setPlayer = function(){
  var r = this.playerResource;
  var box = this.getBox();
  this.game.player = new Sprite(box.frameWidth / 2 - r.frameWidth / 2, box.frameHeight - r.frameHeight, r);
};

GameDirector.prototype.initGame = function(){
  this.stopWave();
  this.setBackground();
  this.setPlayer();
  this.game.shots = [];
  this.game.enemies = [];
  this.game.booms = [];
  this.game.keysPressed = [];
  this.game.stats.wave = 0;
  this.game.stats.score = 0;
  this.game.operations = {};
  this.busyWave = false;
  this.game.stats.mode = 'play';
  for( var i in screens.buttons){ delete screens.buttons[i] };
};

GameDirector.prototype.stopWave = function(){
  if (this.waveId) { clearInterval(this.waveId) }
};

GameDirector.prototype.initWave = function(timeToWait){
  var _this = this;
  this.stopWave();
  this.game.stats.counter = timeToWait;
  this.game.stats.wave += 1;
  this.game.operations = { renderPrepare: screens.renderPrepare };
  
  this.waveId = setInterval(function(){
    if (_this.game.stats.counter > 1) _this.game.stats.counter -= 1;
    else {
	  _this.stopWave();
	  _this.setPlayer();
      _this.game.operations = {
	    renderFireButton: screens.renderFireButton,
        renderScore: screens.renderScore		
	  };
	  var speed = (gameSettings.globalSpeed / 6) * (0.5 + _this.game.stats.wave * 0.1);
      _this.waveGenerator.generate(_this.game.enemies, _this.getBox(), 10, speed);
      _this.busyWave = false;
    }
  }, 1000);
};

GameDirector.prototype.gameHandler = function(){
  var _this = this;

  if (!this.busyWave && !this.game.enemies.length && this.game.stats.mode == 'play'){
    this.busyWave = true;
    helper.runWithDelay(function(){ _this.initWave(3) }, 1000, this.game.stats.wave > 0);
  }
  else if (!this.busyWave && this.game.stats.mode == 'startScreen') {
	  this.busyWave = true;
    this.game.operations = { startScreen: screens.startScreen };
  }
  else if (!this.busyWave && this.game.stats.mode == 'gameOverScreen'){
    this.busyWave = true;
	  helper.runWithDelay(function(){ _this.game.operations = { gameOverScreen: screens.gameOverScreen } }, 2000);
  }
};

GameDirector.prototype.run = function(){
  this.addEvents();
  this.addTouchEvents();
  this.game.operations = {};
  this.game.stats.mode = 'startScreen';

  var _this = this;
  setInterval(function(){ _this.gameHandler() }, 100);
};

window.GameDirector = GameDirector;