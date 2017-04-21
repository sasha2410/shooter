var buttons = {};
var fireButtonHeight = helper.ios() ? 50 : 0;

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
  var text = "PLAY";
  var textX = game.canvas.width / 2 - (fontSize / 1.5 * text.length / 2), textY = game.canvas.height / 2 - fontSize / 2, buttonPadding = 10,
    left = textX - buttonPadding,
    top = textY - fontSize - buttonPadding / 2,
    width = (fontSize / 1.5) * text.length + 1.5 * buttonPadding,
    height =  fontSize + 2 * buttonPadding;

  this.fillRect(left, top, width, height);
  buttons.startScreen = { action: 'initGame', x: left, y: top, frameWidth: width, frameHeight: height };

  this.strokeStyle = '#000000';
  this.fillStyle = '#000000';
  this.font = fontSize + "px Verdana";
  this.fillText(text, textX, textY);

  this.fillStyle = '#ffffff';

  text = 'ALIEN SHOOTER';
  this.fillText('ALIEN SHOOTER', (game.canvas.width / 2) - ((fontSize / 1.5 * text.length) / 2), game.canvas.height / 2 - fontSize / 2 - fontSize * 2);
};

var gameOverScreen = function(game){
  this.fillStyle = '#000000';
  this.fillRect(0, 0, game.canvas.width, game.canvas.height);

  this.fillStyle = '#FFFFFF';

  var fontSize = 30;
  var text = "Start again";
  var textX = game.canvas.width / 2 - (fontSize / 2 * text.length / 2), textY = game.canvas.height / 2 - fontSize / 2, buttonPadding = 10,
    left = textX - buttonPadding,
    top = textY - fontSize - buttonPadding / 2,
    width = (fontSize / 2) * text.length + 2 * buttonPadding,
    height =  fontSize + 2 * buttonPadding;
  this.fillRect(left, top, width, height);
  buttons.gameOverScreen = { action: 'initGame', x: left, y: top, frameWidth: width, frameHeight: height };

  this.strokeStyle = '#000000';
  this.fillStyle = '#000000';
  this.font = fontSize + "px Verdana";
  this.fillText(text, textX, textY);

  fontSize = 30;
  this.font = fontSize + "px Verdana";
  this.fillStyle = '#ffffff';

  text = 'You were failed';
  textX = game.canvas.width / 2 - (fontSize / 2 * text.length / 2);
  this.fillText(text, textX, textY - fontSize * 4);

  text = 'to save the Earth!';
  textX = game.canvas.width / 2 - (fontSize / 2 * text.length / 2);
  this.fillText(text, textX, textY - fontSize * 2.5);

};

var renderScore = function(game){
  var fontSize = 14;
  var textScore = "Score: " + game.stats.score;
  var textWave = "Wave Number: " + game.stats.wave;
  this.save();
  this.globalAlpha = 0.8;
  this.fillStyle = '#000000';
  this.fillRect(0, 0, game.canvas.width, 30);
  this.globalAlpha = 1;
  this.strokeStyle = '#ffffff';
  this.font = fontSize + "px Verdana";
  this.strokeText(textScore, 0, 15);
  this.strokeText(textWave, game.canvas.width - (textWave.length * fontSize), 15);
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
  var text1 = "Prepare to"; 
  var text2 = "ALIEN WAVE " + game.stats.wave;
  var text3 = "( " + game.stats.counter + " )";
  game.context.strokeText(text1, game.canvas.width / 2 - (15 * text1.length / 2), game.canvas.height / 2 - 50)
  game.context.strokeText(text2, game.canvas.width / 2 - (17 * text2.length / 2), game.canvas.height / 2 - 15)
  game.context.strokeText(text3, game.canvas.width / 2 - (15 * text3.length / 2), game.canvas.height / 2 + 30)
  this.restore();
};

window.screens = {
  buttons: buttons,
  fireButtonHeight: fireButtonHeight,
  loading: loading,
  startScreen: startScreen,
  gameOverScreen: gameOverScreen,
  renderScore: renderScore,
  renderFireButton: helper.mobile() ? renderFireButton : function(){ },
  renderPrepare: renderPrepare
};