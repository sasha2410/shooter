var buttons = {};
var fireButtonHeight = 50;

var loading = function(game){
  this.fillStyle = '#000000';
  this.fillRect(0, 0, game.canvas.width, game.canvas.height);
  this.strokeStyle = '#ffffff';
  this.font = "30px Verdana";
  var text = "Loading...";
  this.strokeText(text, game.canvas.width / 2 - (15 * text.length / 2), game.canvas.height / 2 - 15)
};

var startScreen = function(game){
  this.fillStyle = '#000000';
  this.fillRect(0, 0, game.canvas.width, game.canvas.height);

  this.fillStyle = '#FFFFFF';

  var fontSize = 30;
  var text = "Click to start";
  var textX = game.canvas.width / 2 - (fontSize / 2 * text.length / 2), textY = game.canvas.height / 2 - fontSize / 2, buttonPadding = 10,
    left = textX - buttonPadding,
    top = textY - fontSize - buttonPadding / 2,
    width = (fontSize / 2) * text.length + buttonPadding,
    height =  fontSize + 2 * buttonPadding;

  this.fillRect(left, top, width, height);

  this.strokeStyle = '#000000';
  this.fillStyle = '#000000';
  this.font = fontSize + "px Verdana";
  this.fillText(text, textX, textY);

  this.fillStyle = '#ffffff';

  text = 'ALIEN SHOOTER';
  this.fillText('ALIEN SHOOTER', game.canvas.width / 2 - (fontSize / 1.5 * text.length / 2), game.canvas.height / 2 - fontSize / 2 - fontSize * 2);
  buttons.startScreen = { action: 'initGame', x: left, y: top, frameWidth: width, frameHeight: height }
};

var gameOverScreen = function(game){
  this.fillStyle = '#000000';
  this.fillRect(0, 0, game.canvas.width, game.canvas.height);

  this.fillStyle = '#FFFFFF';

  var fontSize = 30;
  var text = "Click to start again";
  var textX = game.canvas.width / 2 - (fontSize / 2 * text.length / 2), textY = game.canvas.height / 2 - fontSize / 2, buttonPadding = 10,
    left = textX - buttonPadding,
    top = textY - fontSize - buttonPadding / 2,
    width = (fontSize / 2) * text.length + buttonPadding,
    height =  fontSize + 2 * buttonPadding;

  this.fillRect(left, top, width, height);

  this.strokeStyle = '#000000';
  this.fillStyle = '#000000';
  this.font = fontSize + "px Verdana";
  this.fillText(text, textX, textY);

  this.fillStyle = '#ffffff';
  this.fillText('You lost. Try again?', textX, textY - fontSize * 2);
  buttons.gameOverScreen = { action: 'initGame', x: left, y: top, frameWidth: width, frameHeight: height }
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

var renderFireButton = function(game){
  this.save();
  
  this.globalAlpha = 0.8;
  this.fillStyle = '#000000';
  this.fillRect(0, game.canvas.height - fireButtonHeight, game.canvas.width, game.canvas.height);

  var fontSize = 15;
  var text = "Touch to FIRE!";
  var textX = game.canvas.width / 2 - (fontSize / 2 * text.length / 2), textY = game.canvas.height - fireButtonHeight / 2,
    left = 0,
    top = game.canvas.height - fireButtonHeight,
    width = game.canvas.width,
    height =  fireButtonHeight;
	
  this.fillStyle = '#FFFFFF';
  this.fillRect(left, top, width, height);

  this.fillStyle = '#ff0000';
  this.font = fontSize + "px Verdana";
  this.fillText(text, textX, textY);
  buttons.startScreen = { action: 'playerFire', x: left, y: top, frameWidth: width, frameHeight: height }
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

window.screens = {
  buttons: buttons,
  fireButtonHeight: fireButtonHeight,
  loading: loading,
  startScreen: startScreen,
  gameOverScreen: gameOverScreen,
  renderScore: renderScore,
  renderFireButton: renderFireButton,
  renderPrepare: renderPrepare
};