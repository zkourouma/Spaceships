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
  for (var i = 0; i < 20; i++) {
    this.randomAsteroid();
  };
  this.score = 0;
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

Game.prototype.draw = function(img, img2, img3){
  var that = this;

  that.ctx.drawImage(img, 0, 0, that.xDim, that.yDim);

  this.ctx.fillStyle = "white";
  this.ctx.font = "italic "+20+"pt Arial ";
  this.ctx.fillText("Score: " + that.score, that.xDim - 200, 30);

  this.asteroids.forEach(function(el, i, arr){
    el.draw(that.ctx, img2);
  });

  this.ship.draw(that.ctx, img3);

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

  if (that.ship.isHit(that.asteroids)){
    var img4 = new Image();
    img4.src = 'xplosion.png';
    // img4.onload = function(){
//       that.ctx.drawImage(img4, that.ship.x - that.ship.radius,
//                          that.ship.y - that.ship.radius,
//                          that.ship.radius * 2,
//                          that.ship.radius * 2);
//     }

    that.drawExplosion(img4);

    window.clearInterval(that.timer);
  }
  that.bullets.forEach(function(el, i, arr){
    if (el.hitAsteroid(that.asteroids)[0]){
      var img5 = new Image();
      img5.src = 'dead_asteroid.png';

      that.drawBlowUp(img5, el.x, el.y, el.radius);

      that.asteroids.splice(el.hitAsteroid(that.asteroids)[1], 1);
      that.bullets.splice(i, 1);
      that.score += 1;
      that.randomAsteroid();
    }
    if (el.offScreen(that)){
      that.bullets.splice(i, 1);
    }
    el.update(el.velocity);
  })
};

Game.prototype.drawExplosion = function(img4){
  this.ctx.drawImage(img4, this.ship.x - this.ship.radius-40,
                     this.ship.y - this.ship.radius-40,
                     this.ship.radius * 10,
                     this.ship.radius * 10);
}

Game.prototype.drawBlowUp = function(im5, x, y, rad){
  this.ctx.drawImage(im5, x - rad-40, y-rad-40, rad * 30, rad * 30);
}

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
      that.ctx.drawImage(img2, el.x - el.radius,
                         el.y - el.radius,
                         el.radius * 2,
                         el.radius * 2);
    }
  })

  var img3 = new Image();
  img3.src = 'spaceship.png';
  img3.onload = function () {
    that.ctx.drawImage(img3, that.ship.x - that.ship.radius,
                       that.ship.y - that.ship.radius,
                       that.ship.radius * 2,
                       that.ship.radius * 2);
  };



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

  key("p", function(){
    alert("Game paused");
  })

  this.timer = window.setInterval(function(){
    that.draw(img, img2, img3);
    that.update();
    if (that.asteroids.length === 0){
      window.clearInterval(that.timer);
      alert("kill yourself");
    }
  }, 31.25);
};

function Ship(x, y){
  this.x = x;
  this.y = y;
  this.radius = 15;
  this.velocity = {x: 0, y: 0};
}
Ship.prototype = new Surrogate();

Ship.prototype.draw = function(ctx, img3){
  ctx.drawImage(img3, this.x - this.radius,
                     this.y - this.radius,
                     this.radius * 2,
                     this.radius * 2)
};

Ship.prototype.isHit = function(asteroids){
  var that = this;
  var hit = false;
  asteroids.forEach(function(el, i, arr){
    if (Math.sqrt(Math.pow(el.x - that.x, 2) +
        Math.pow(el.y - that.y, 2)) < el.radius/1.25 + that.radius){
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

Ship.prototype.fireBullet = function (game) {
  new Bullet({x: this.x, y: this.y}, this.velocity, game);
}

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
}

Bullet.prototype.update = function(obj){
  this.x += obj.x;
  this.y += obj.y;
  this.velocity
}

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