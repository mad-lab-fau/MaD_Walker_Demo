function LinearMask(numDots, life, dotSpeed, walker, width, height) {
  this.walker = wwaker;
  this.numDots = numDots;
  this.life = life;
  this.dotSpeed = speed;
  this.width = width;
  this.height = height;

  this.dotsX = new Array(numDots);
  this.dotsY = new Array(numDots);
  this.dotsXdir = new Array(numDots);
  this.dotsYdir = new Array(numDots);
  this.dotsTime = new Array(numDots);

  for (var i = 0; i < numDots; i++) {
    this.dotsX[i] = Math.random() * width - width / 2;
    this.dotsY[i] = Math.random() * height - height / 2;

    var rot = Math.random() * Math.PI * 2;
    this.dotsXdir[i] = Math.sin(rot);
    this.dotsYdir[i] = Math.cos(rot);

    this.dotsTime[i] = Math.random() * life;
  }
}

LinearMask.prototype.draw = function (dt) {
  if (dt <= 0)
    return;
  for (var i = 0; i < this.numDots; i++) {
    dotsX[i] = dotsX[i] + dotsXdir[i] * dt * this.dotSpeed;
    dotsY[i] = dotsY[i] + dotsYdir[i] * dt * this.dotSpeed;
    dotsTime[i] += dt;
    if ((dotsTime[i] > this.life) || (dotsX[i] > width / 2) || (dotsX[i] < -width / 2) || (dotsY[i] > height / 2) || (dotsY[i] < -height / 2)) {
      if (dotsTime[i] > this.life) {
        dotsTime[i] -= this.life;
      }
      dotsX[i] = Math.random() * this.width - this.width / 2;
      dotsY[i] = Math.random() * this.height - this.height / 2;

      var rot = Math.random() * Math.PI * 2;
      dotsXdir[i] = Math.sin(rot);
      dotsYdir[i] = Math.cos(rot);
    }
    this.walker.drawDot(this.walker.offsetx + dotsX[i], this.walker.offsety + dotsY[i]);
  }
}