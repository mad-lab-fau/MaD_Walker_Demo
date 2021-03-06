function Walker() {
  this.ctx; // Canvas context (used for drawing on)
  this.walker_object = 0;
  this.walker_size = 5;
  this.pixelsperdegree = 37;

  //graphical stuff
  this.offsetx = 0;
  this.offsety = 0;
  this.walker_colour = "#000000";
  this.sticks_force_visible = false;
  this.dotsize = 4;

  this.dotShapes = [];
  this.linesdrawn = false;

  // walker specific variables 
  this.walker_speed = 3;
  this.walker_speedStrings = new Array("slowwalking", "normwalking", "fastwalking", "slowrunning", "fastrunning");
  this.walker_slope = 4;
  this.walker_slopeValues = new Array(-30, -20, -10, 0, 10, 20, 30);
  this.walker_slopeStrings = new Array("m30", "m20", "m10", "00", "10", "20", "30");
  this.walker_gravity = 2;
  this.walker_gravityStrings = new Array("1_62", "9_81", "24_79");

  //general stuff
  this.walker_sticks = true;
  this.walker_PlaybackSpeed = 1;

  this.flicker_ontime = 100;
  this.flicker_duration = 1;
  this.flicker_randomness = 0;

  this.markers_invisible = null;

  //current data
  this.dataStr = "";

  //--------------INTERNAL IABLES--------------------
  this.walkersizefactor = 1500;

  this.nummarkersMaD = 15;
  this.durationstd = 0;
  this.dotsonratio = 0;
  this.dotduration = 0;
  this.durationon = 0;
  this.durationoff = 0;

  //MaD Walker test
  this.data = new Data();

  //flicker stuff
  this.dottime = [];
  this.dotstats = [];
}

Walker.prototype.constructor = Walker;

Walker.prototype.init = function () {

  var n;

  //get initial data set
  var subjectStr = "Sub150716_1";
  var speedString = this.walker_speedStrings[this.walker_speed - 1];
  var slopeStr = "slope_" + this.walker_slopeStrings[this.walker_slope - 1];
  var gravityStr = "gravity_" + this.walker_gravityStrings[this.walker_gravity - 1];
  this.dataStr = subjectStr + "_" + speedString + "_" + slopeStr + "_" + gravityStr;
  console.log(this.dataStr);
  

  //dot flicker initialization stuff
  this.durationstd = this.flicker_randomness / 100;
  this.dotsonratio = this.flicker_ontime / 100.0;
  this.dotduration = this.flicker_duration;
  this.durationon = (this.dotsonratio) * this.flicker_duration;
  this.durationoff = (1 - (this.dotsonratio)) * this.flicker_duration;

  for (n = 0; n < this.nummarkersMaD; n++) {
    this.dotstats[n] = (Math.random() < this.dotsonratio);
    if (this.dotstats[n]) {
      this.dottime[n] = Math.random() * (this.durationon) * 1000;
    } else {
      this.dottime[n] = Math.random() * (this.durationoff) * 1000;
    }
    var dot = { x: 0, y: 0 }
    this.dotShapes.push(dot);
  }

}

Walker.prototype.calcNode = function (curtime) { // curtime in ms
  
  var nNodes = this.data[this.dataStr].length;
  var curtimeMod = (curtime/1000*this.walker_PlaybackSpeed) % this.data[this.dataStr][nNodes-1][1]; // in s*walker_PlaybackSpeed
  var diff = new Array(nNodes);
  var minDiff = 9999;
  var curNode = -1;
  for (var iNode = 0; iNode < nNodes-1; iNode++){
    diff[iNode] = Math.abs(this.data[this.dataStr][iNode][1] - curtimeMod);
    if (diff[iNode] < minDiff){
      minDiff = diff[iNode];
      curNode = iNode;
    }
  }
  
  return curNode;
}

//function that draws walker
Walker.prototype.drawWalker = function (curtime) {

  var n;
  for (n = 0; n < this.nummarkersMaD; n++) {
    while (curtime > this.dottime[n]) {
      if (this.dotstats[n] > 0) {
        this.dotstats[n] = 0;
      } else {
        this.dotstats[n] = 1;
      }
      var changeval = 0;

      if ((this.durationon == 0) && (this.durationoff == 0)) {
        this.dotstats[n] = 1;
        this.dottime[n] = curtime;
        break;
      }
      if (this.dotstats[n] == 1) {
        changeval = randn() * this.durationstd;
        if (changeval < -0.995) changeval = -0.995;
        if (changeval > 0.995) changeval = 0.995;
        this.dottime[n] = this.dottime[n] + (this.durationon) * 1000 + changeval * this.durationon * 1000;
      } else {
        changeval = randn() * this.durationstd;
        if (changeval < -0.995) changeval = -0.995;
        if (changeval > 0.995) changeval = 0.995;
        this.dottime[n] = this.dottime[n] + (this.durationoff) * 1000 + changeval * this.durationoff * 1000;
      }
    }
  }

  var curnode = this.calcNode(curtime);

  var vectors  = new Array(this.nummarkersMaD+2); // plus two points to define the ground
  for (n = 0; n < this.nummarkersMaD; n++) {
    var xpos =   this.offsetx + (   this.data[this.dataStr][curnode][(n+1)*2  ] * 1000 / this.walkersizefactor) * this.walker_size * this.pixelsperdegree;
    var ypos = 2*this.offsety + (-1*this.data[this.dataStr][curnode][(n+1)*2+1] * 1000 / this.walkersizefactor) * this.walker_size * this.pixelsperdegree;
    vectors[n] = new Array(xpos, ypos);
   
    this.drawDot(xpos, ypos);
  }

  // Draw floor
  var slope = this.walker_slopeValues[this.walker_slope - 1]/180*Math.PI; // slope in radians
  var xval1 = -5000;
  var xval2 = 5000;
  var yval1 = 0;
  var yval2 = 0;
  var xval1 = Math.cos(slope)*xval1 - Math.sin(slope)*yval1;
  var yval1 = Math.sin(slope)*xval1 + Math.cos(slope)*yval1;
  var xval2 = Math.cos(slope)*xval2 - Math.sin(slope)*yval2;
  var yval2 = Math.sin(slope)*xval2 + Math.cos(slope)*yval2;

  var xpos1 =     this.offsetx + (xval1 / this.walkersizefactor) * this.walker_size * this.pixelsperdegree;
  var ypos1 =  2* this.offsety + (yval1 / this.walkersizefactor) * this.walker_size * this.pixelsperdegree;
  var xpos2 =     this.offsetx + (xval2 / this.walkersizefactor) * this.walker_size * this.pixelsperdegree;
  var ypos2 =  2* this.offsety + (yval2 / this.walkersizefactor) * this.walker_size * this.pixelsperdegree;
  vectors[n+1] = new Array(xpos1, ypos2);
  vectors[n+2] = new Array(xpos2, ypos1);
  this.drawLineX(vectors[n+1], vectors[n+2], "#000000");

  // Draw metabolic rate
  this.ctx.font = "14px Arial";
  this.ctx.fillText("Metabolic Rate:", 10, 20); 
  var metRate = this.data[this.dataStr][curnode][30];
  this.ctx.lineWidth = 10;
  this.drawLineX(new Array(110, 15), new Array(metRate*2+110, 15), "#003660");
  this.ctx.lineWidth = 1;

  if (this.walker_sticks) {
    if (this.walker_object == 0) {
      // Trunk
      this.drawLineX(vectors[0], vectors[1], this.walker_colour);
      // Rigth leg
      this.drawLineX(vectors[1], vectors[2], this.walker_colour);
      this.drawLineX(vectors[2], vectors[3], this.walker_colour);
      this.drawLineX(vectors[3], vectors[4], this.walker_colour);
      this.drawLineX(vectors[4], vectors[5], this.walker_colour);
      this.drawLineX(vectors[5], vectors[3], this.walker_colour); // back to the ankle
      // Left leg
      this.drawLineX(vectors[1], vectors[6], this.walker_colour);
      this.drawLineX(vectors[6], vectors[7], this.walker_colour);
      this.drawLineX(vectors[7], vectors[8], this.walker_colour);
      this.drawLineX(vectors[8], vectors[9], this.walker_colour);
      this.drawLineX(vectors[9], vectors[7], this.walker_colour); // back to the ankle
      // Right foot without deformation
      this.drawLineX(vectors[3], vectors[10], this.walker_colour);
      this.drawLineX(vectors[10], vectors[11], this.walker_colour);
      this.drawLineX(vectors[11], vectors[3], this.walker_colour); // back to the ankle
      // Left foot without deformation
      this.drawLineX(vectors[7], vectors[12], this.walker_colour);
      this.drawLineX(vectors[12], vectors[13], this.walker_colour);
      this.drawLineX(vectors[13], vectors[7], this.walker_colour); // back to the ankle
    }
  }
}

Walker.prototype.drawDot = function (x, y) {
  this.ctx.fillStyle = this.walker_colour;
  this.ctx.beginPath();
  this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
  this.ctx.fill();
  this.ctx.closePath();
}


Walker.prototype.drawLineX = function (vectorFrom, vectorTo, color) {

  var moveX = vectorFrom[0];
  var moveY = vectorFrom[1];
  var lineX = vectorTo[0];
  var lineY = vectorTo[1];

  this.ctx.strokeStyle = color;
  this.ctx.beginPath();
  this.ctx.moveTo(moveX, moveY);
  this.ctx.lineTo(lineX, lineY);
  this.ctx.stroke();
  this.ctx.closePath();

}


//found this somewhere on the internet
Walker.prototype.drawCircle = function (radius, x, y) {
  // The angle of each of the eight segments is 45 degrees (360 divided by 8), which
  // equals p/4 radians.
  var angleDelta = Math.PI / 4;

  // Find the distance from the circle's center to the control points for the curves.
  var ctrlDist = radius / Math.cos(angleDelta / 2);

  // Initialize the angle to 0 and define local variables that are used for the 
  // control and ending points. 
  var angle = 0;
  var rx, ry, ax, ay;

  // Move to the starting point, one radius to the right of the circle's center.
  this.linecanvas.graphics.moveTo(x + radius, y);

  // Repeat eight times to create eight segments.
  for (var i = 0; i < 8; i++) {

    // Increment the angle by angleDelta (p/4) to create the whole circle (2p).
    angle += angleDelta;

    // The control points are derived using sine and cosine.
    rx = x + Math.cos(angle - (angleDelta / 2)) * (ctrlDist);
    ry = y + Math.sin(angle - (angleDelta / 2)) * (ctrlDist);

    // The anchor points (end points of the curve) can be found similarly to the 
    // control points.
    ax = x + Math.cos(angle) * radius;
    ay = y + Math.sin(angle) * radius;

    // Draw the segment.
    this.linecanvas.graphics.curveTo(rx, ry, ax, ay);
  }
}
