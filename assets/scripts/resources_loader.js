var ResourcesLoader = function (data){
  this.data = data;
  this.loaded = false;
  this.numResourcesLoaded = 0;
};
 
ResourcesLoader.prototype.load = function(callback){
  var _this = this;
  var resourcesLoaded = function(){ return Object.keys(this.data).length == this.numResourcesLoaded };

  var c = setInterval(function(){  
    if (resourcesLoaded.call(_this)) {
      clearInterval(c);
      _this.loaded = true;
      if (callback){ callback(); }
    }
  }, 100);

  for(var i in this.data){
    var image = new Image();
    image.id = i;
    image.onload = function (){
      _this.numResourcesLoaded += 1;
      _this.data[this.id].cachedImage = this;
    };
    image.src = this.data[i].url;
  };
};

window.ResourcesLoader = ResourcesLoader;