function MovingObject(x, y){
  this.x = x;
  this.y = y;
}

MovingObject.prototype.update = function(obj){
  this.x += obj.x;
  this.y += obj.y;
};

MovingObject.prototype.offScreen = function(gameObj){
  return (this.x > gameObj.xDim || this.y > gameObj.yDim);
};

function Asteroid(x, y){
  this.x = x;
  this.y = y;
  this.radius = 25 * Math.random();
}

function Surrogate() {};
Surrogate.prototype = MovingObject.prototype;
Asteroid.prototype = new Surrogate();

Asteroid.prototype.draw = function(ctx){
  // var canvas = document.getElementById('canvas');
  // var c = canvas.getContext('2d');
  ctx.beginPath();
  ctx.fillStyle = "blue";
  var startAngle = 0;
  var endAngle = 2 * Math.PI;
  var counterClockwise = false;
  ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, counterClockwise);
  ctx.fill();
};



function Game(xDim, yDim, ctx){
  this.xDim = xDim;
  this.yDim = yDim;
  this.ctx = ctx;
  this.asteroids = [];
  this.ship = new Ship(xDim/2, yDim/2);
  for (var i = 0; i < 10; i++) {
    this.randomAsteroid();
  };
};

Game.prototype.randomAsteroid = function(){
  var x = Math.floor(Math.random() * this.xDim);
  var y = Math.floor(Math.random() * this.yDim);
  this.asteroids.push(new Asteroid(x, y));
};

Game.prototype.draw = function(){
  this.ctx.clearRect(0, 0, this.xDim, this.yDim);
  this.ctx.fillStyle = "yellow";
  this.ctx.fillRect(0,0,this.xDim,this.yDim);
  var that = this;
  this.asteroids.forEach(function(el, i, arr){
    el.draw(that.ctx);
  });
  this.ship.draw(this.ctx);
  console.log(this.ship);
};

Game.prototype.update = function(){
  var that = this;
  this.asteroids.forEach(function(el, i, arr){
    el.update({x: 2, y: 2});
    if (el.x > that.xDim || el.y > that.yDim){
      that.asteroids.splice(i, 1);
      that.randomAsteroid();
    }
  });
};

Game.prototype.start = function(){
  var that = this;
  window.setInterval(function(){
    that.draw();
    that.update();
  }, 31.25);
};

function Ship(x, y){
  this.x = x;
  this.y = y;
  this.radius = 15;
  this.velocity = {x: 0, y: 0};
}
Ship.prototype = new Surrogate();

Ship.prototype.draw = function(ctx){
  ctx.beginPath();
  ctx.fillStyle = "black";
  var startAngle = 1.7 * Math.PI;
  var endAngle = 0.8 * Math.PI;
  var counterClockwise = false;
  ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, counterClockwise);
  ctx.fill();
};

Ship.prototype.isHit = function(){

};

Ship.prototype.update = function(){

};