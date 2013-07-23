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
  var dir = Math.random() < 0.5 ? -1 : 1
  this.velocity = {
    x: Math.random() * 2 * dir,
    y: Math.random() * 2 * dir}
}

function Surrogate() {};
Surrogate.prototype = MovingObject.prototype;
Asteroid.prototype = new Surrogate();

Asteroid.prototype.draw = function(ctx){
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
  for (var i = 0; i < 9; i++) {
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
};

Game.prototype.update = function(){
  var that = this;
  that.ship.update(that.ship.velocity);
  if (that.ship.x > that.xDim){
    that.ship.x = 0;
  }
  else if (that.ship.x < 0){
    that.ship.x = that.xDim;
  }
  if (that.ship.y > that.yDim){
    that.ship.y = 0;
  }
  else if (that.ship.y < 0){
    that.ship.y = that.yDim;
  }
  that.asteroids.forEach(function(el, i, arr){
    el.update(el.velocity);
    if (el.x > that.xDim || el.y > that.yDim || el.x < 0 || el.y < 0){
      that.asteroids.splice(i, 1);
      that.randomAsteroid();
    }
  });
  if (this.ship.isHit(this.asteroids)){
    var that = this;
    window.clearInterval(that.timer);
    alert("Game over!");
  }
};

Game.prototype.start = function(){
  var that = this;
  key("up", function(){
    that.ship.power(0, -1)
  });

  key("down", function(){
    that.ship.power(0, 1)
  });

  key("left", function(){
    that.ship.power(-1, 0)
  });

  key("right", function(){
    that.ship.power(1, 0)
  });
  this.timer = window.setInterval(function(){
    that.draw();
    that.update();
  }, 31.25);
};

function Ship(x, y){
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.velocity = {x: 0, y: 0};
}
Ship.prototype = new Surrogate();

Ship.prototype.draw = function(ctx){
  ctx.beginPath();
  ctx.fillStyle = "black";
  var startAngle = 0;
  var endAngle = 2 * Math.PI;
  var counterClockwise = false;
  ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, counterClockwise);
  ctx.fill();
};

Ship.prototype.isHit = function(asteroids){
  var that = this;
  var hit = false;
  asteroids.forEach(function(el, i, arr){
    if (Math.sqrt(Math.pow(el.x-that.x, 2) +
        Math.pow(el.y-that.y, 2)) < el.radius + that.radius){
      hit = true;
    }
  });
  return hit;
};

Ship.prototype.update = function(obj){
  this.x += obj.x;
  this.y += obj.y;
};

Ship.prototype.power = function(dx, dy){
  this.velocity.x += dx;
  this.velocity.y += dy;
}