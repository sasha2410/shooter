var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas, context;  

var resourcesLoaded = function(){ return Object.keys(resources).length == numResourcesLoaded }                           
var numResourcesLoaded = 0;                        
var resources = { 
  helicopter: { 
    url: 'assets/models/hcopter.png', 
    framesCount: 3, 
    frameWidth: 20, 
    frameHeight: 38,
    cachedImage: null 
  }
};
var objects = [];


var render = function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (resourcesLoaded()){
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for(var i in objects){ objects[i].render(context); }
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

var lastTime;

var main = function(){
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;
  
  render();
  
  lastTime = now;
  requestAnimationFrame(main);
};

var loadSprites = function(){
  for(var i in resources){
    var image = new Image();
    image.id = 'helicopter';
    image.onload = function (){ 
      numResourcesLoaded += 1;
      resources[this.id].cachedImage = this;
    };
    image.src = resources[i].url;
  };
};

var c = setInterval(function(){  
    if (resourcesLoaded()) {
      clearInterval(c);
      objects.push(new Sprite(0, 0, resources.helicopter));
    }
  }, 0
);


var initialize = function(){
  canvas = document.getElementById('game');
  context = canvas.getContext('2d');
  loadSprites();
  main();
};
