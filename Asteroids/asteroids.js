function MovingObject(x, y){
  this.x = x;
  this.y = y;
}

MovingObject.prototype.update = function(obj){
  this.x += obj.x;
  this.y += obj.y;
};

MovingObject.prototype.offScreen = function(gameObj){
  return (this.x > gameObj.xDim || this.y > gameObj.yDim || this.x < 0 || this.y < 0);
};

function Asteroid(x, y){
  this.x = x;
  this.y = y;
  this.radius = 20 * (Math.random() + 1);
  var dir = Math.random() < 0.5 ? -1 : 1
  this.velocity = {
    x: Math.random() * 2 * dir,
    y: Math.random() * 2 * dir}
}

function Surrogate() {};
Surrogate.prototype = MovingObject.prototype;
Asteroid.prototype = new Surrogate();

Asteroid.prototype.draw = function(ctx, img2){
  ctx.drawImage(img2, this.x - this.radius,
                     this.y - this.radius,
                     this.radius * 2,
                     this.radius * 2);

};



function Game(xDim, yDim, ctx){
  this.xDim = xDim;
  this.yDim = yDim;
  this.ctx = ctx;
  this.asteroids = [];
  this.bullets = [];
  this.ship = new Ship(xDim/2, yDim/2);
  for (var i = 0; i < 5; i++) {
    this.randomAsteroid();
  };
};

Game.prototype.randomAsteroid = function(){
  var x;
  var y;
  if (Math.random() > 0.5){

    if (Math.random() > 0.5){
      x = Math.floor(Math.random() * (50));
    }
    else{
      x = Math.floor(Math.random() * (this.xDim-(this.xDim-50)) + (this.xDim-50));
    }

    y = Math.floor(Math.random() * (this.yDim));

  }
  else{
    if (Math.random() > 0.5){
      y = Math.floor(Math.random() * (50));
    }
    else{
      y = Math.floor(Math.random() * (this.yDim-(this.yDim-50)) + (this.yDim-50));
    }

    x = Math.floor(Math.random() * (this.xDim));

  };

  this.asteroids.push(new Asteroid(x, y));
};

Game.prototype.draw = function(img, img2){
  var that = this;

  that.ctx.drawImage(img, 0, 0, that.xDim, that.yDim);

  this.asteroids.forEach(function(el, i, arr){
    el.draw(that.ctx, img2);
  });

  this.ship.draw(this.ctx);

  this.bullets.forEach(function(el, i, arr){
    el.draw(that.ctx);
  });
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
    if (el.offScreen(that)){
      that.asteroids.splice(i, 1);
      that.randomAsteroid();
    }
  });

  if (this.ship.isHit(this.asteroids)){
    var that = this;
    window.clearInterval(that.timer);
  }
  that.bullets.forEach(function(el, i, arr){
    if (el.hitAsteroid(that.asteroids)[0]){
      that.asteroids.splice(el.hitAsteroid(that.asteroids)[1], 1);
      that.bullets.splice(i, 1);
      if (Math.random() > 0.5){
        that.randomAsteroid();
      }
    }
    if (el.offScreen(that)){
      that.bullets.splice(i, 1);
    }
    el.update(el.velocity);
  })
};

Game.prototype.start = function(){
  var that = this;

  var img = new Image();
  img.src = 'space.png';
  img.onload = function () {
    that.ctx.drawImage(img, 0, 0, that.xDim, that.yDim);
  };

  var img2 = new Image();
  img2.src = 'asteroid.png';

  this.asteroids.forEach(function(el, i, arr){
    img2.onload = function(){
      that.ctx.drawImage(img2, el.x - el.radius/2,
                         el.y - el.radius/2,
                         el.radius * 2,
                         el.radius * 2);
    }
  })

  key("up", function(){
    if (that.ship.velocity.y > 0){
      that.ship.velocity.y = 1
    }
    that.ship.power(0, -1)
  });

  key("down", function(){
    if (that.ship.velocity.y < 0){
      that.ship.velocity.y = -1
    }
    that.ship.power(0, 1)
  });

  key("left", function(){
    if (that.ship.velocity.x > 0){
      that.ship.velocity.x = 1
    }
    that.ship.power(-1, 0)
  });

  key("right", function(){
    if (that.ship.velocity.x < 0){
      that.ship.velocity.x = -1
    }
    that.ship.power(1, 0)
  });

  key("space", function(){
    that.ship.fireBullet(that);
  });

  this.timer = window.setInterval(function(){
    that.draw(img, img2);
    that.update();
    // if (that.asteroids.length === 0){
//       window.clearInterval(that.timer);
//       alert("kill yourself");
//     }
  }, 31.25);
};

function Ship(x, y){
  this.x = x;
  this.y = y;
  // this.midX = x;
//   this.midY = y + 15;
  // this.direction = {x: this.x - this.midX,
//                     y: this.y - this.midY}
  this.radius = 10;
  this.velocity = {x: 0, y: 0};
}
Ship.prototype = new Surrogate();

Ship.prototype.draw = function(ctx){
  ctx.beginPath();
  ctx.fillStyle = "#00bdda";

  ctx.moveTo(this.x,this.y);
  ctx.lineTo(this.x-10,this.y+30);
  ctx.lineTo(this.x+10,this.y+30);
  ctx.closePath();
  ctx.fill();
};

Ship.prototype.isHit = function(asteroids){
  var that = this;
  var hit = false;
  asteroids.forEach(function(el, i, arr){
    if (Math.sqrt(Math.pow(el.x - that.x, 2) +
        Math.pow(el.y - that.x, 2)) < el.radius/1.25 + that.radius){
      hit = true;
    }
  });
  return hit;
};

Ship.prototype.update = function(obj){
  // this.direction = {x: this.x - this.midX,
  //                   y: this.y - this.midY}
  this.x += obj.x;
  this.y += obj.y;
  // this.midX = this.x;
//   this.midY = this.y + 15;
};

Ship.prototype.power = function(dx, dy){
  this.velocity.x += dx;
  this.velocity.y += dy;
};

// Ship.prototype.rotate = function(x, y){
//
// };

Ship.prototype.fireBullet = function (game) {
  new Bullet({x: this.x, y: this.y}, this.velocity, game);
};

function Bullet(position, velocity, game){
  game.bullets.push(this);
  this.x = position.x;
  this.y = position.y;
  this.game = game;
  this.speed = 7;
  this.radius = 2;

  this.direction = {x: (velocity.x/Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2))),
                    y: (velocity.y/Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)))};

  this.velocity = {x: this.direction.x * this.speed,
                   y: this.direction.y * this.speed};
}

Bullet.prototype = new Surrogate();

Bullet.prototype.draw = function(ctx){
  ctx.beginPath();
  ctx.fillStyle = "#d4c400";
  var startAngle = 0;
  var endAngle = 2 * Math.PI;
  var counterClockwise = false;
  ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, counterClockwise);
  ctx.fill();
};

Bullet.prototype.update = function(obj){
  this.x += obj.x;
  this.y += obj.y;
  this.velocity
};

Bullet.prototype.hitAsteroid = function(asteroids){
  var that = this;
  var returnArr = [false];
  asteroids.forEach(function(el, i, arr){
    if (Math.sqrt(Math.pow(el.x-that.x, 2) +
        Math.pow(el.y-that.y, 2)) < el.radius + that.radius){
      returnArr[0] = true;
      returnArr.push(i);
    }
  });
  return returnArr;
};