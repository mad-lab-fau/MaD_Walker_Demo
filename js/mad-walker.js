/* Initialize and declare all variables */
var walk = new Walker();

var c, cc;
var timer, starttime, curtime, timediff, lastmousetime;

var weightslider = document.getElementById('weightslider');
var btnreset = document.getElementById('btnreset');
var btnright = document.getElementById('rotateright');
var btnleft = document.getElementById('rotateleft');
var pauseswitch = document.getElementById('pauseswitch');
var linesswitch = document.getElementById('linesswitch');

// Not using these currently 
var colorpicker = document.getElementById('colorpicker');
var dotsizeslider = document.getElementById('dotsizeslider');

var rotRight = false;
var rotLeft = false;
var rot = -1;

var paused = false;
var lines = false;

var mousespindown = false;
var lastx = 0;
var lasty = 0;
var spindirx = 1;
var spindiry = 0;
var lastmousetime;
var spinspeed = 0;
var spinmatrix = newIdentMatrix();
var spinning = false;
var spin_azimuth = 0;
var spin_azimuth_dir = 0;
var spin_distance = 0;

var done = false;
/* end of variable initialization */

window.onload=function() {
  init();
  setInterval(update, 1000/60);
}

function Timer(init, precision) {
  var start = time = new Date(init || null).valueOf(),
  precision = precision || 10;

  setInterval(function () { time += precision; }, precision);

  this.getTimer = function() { return time - start; };
  this.getDate = function() { return new Date(time); };
  this.setTimer = function(t) { time = new Date(t).valueOf(); }
}

function init() {
  c = document.getElementById('wc');
  cc = c.getContext('2d');

  timer = new Timer();
  starttime = timer.getTimer();
  lasttime = starttime;
  lastmousetime = timer.getTimer();

  init_walker();

  btnreset.addEventListener("click", function() {
    timer.setTimer(0);
    init_walker();
    reset_controls();
    if(paused) { paused = false; }
  }, false);

  pauseswitch.addEventListener("change", function() {
    if(!paused) {
      lasttime = timer.getTimer();
      paused = true;
    }
    else {
      timer.setTimer(lasttime);
      paused = false;
    }
  });

  linesswitch.addEventListener("change", function() {
    walk.walker_sticks = !walk.walker_sticks;
    lines = !lines;
  });


  weightslider.addEventListener("input", function() {
    change_controls(weightslider.value, timer.getTimer());
  }, false);


  btnleft.addEventListener("mousedown", function(e) {
    rotLeft = true;
    mousedown_rotate(e);
  });
  btnleft.addEventListener("mouseup", mouseup_rotate);

  btnright.addEventListener("mousedown", function(e) {
    rotRight = true;
    mousedown_rotate(e);
  });
  btnright.addEventListener("mouseup", mouseup_rotate);

  c.addEventListener("mousedown", function(e) {
    e.preventDefault();
    mousespindown = true;
  });

  c.addEventListener("mousemove", mousespin);

  c.addEventListener("mouseup", function(e) {
    mousespindown = false;
  });

  document.body.addEventListener("mouseup", function(e) {
    mousespindown = false;
  });

}

function update() {
  if(!paused) {
    cc.fillStyle='black';
    cc.fillRect(0,0,c.width,c.height);

    curtime = timer.getTimer() - starttime;

    if(spinning) {
      spin_walker(timer.getTimer(), curtime);
    } else {
      spinmatrix = newIdentMatrix();
    }

    //lasttime = curtime;
    walk.spinmatrix=spinmatrix;
    walk.drawWalker(curtime);
  }
}

function init_walker(){
  //lines = false;
  walk = new Walker();
  walk.ctx = cc;
  walk.walker_colour = "#ffffff";
  walk.walker_size = 10;
  walk.dotsize = 3;
  walk.offsetx = c.width/2;
  walk.offsety = c.height/2;
  //handleResize();

  walk.init();
  walk.walker_sticks = false;
 
}

function reset_controls() {
  weightslider.value = 64;

  linesswitch.checked = false;
  pauseswitch.checked = false;
}

function change_controls(weight, t){
  var freq = walk.getFrequency();
  walk.walker_weight = -6 * (weight - 64)/64;
  walk.init();
  var difffreq = freq/walk.getFrequency();
  starttime = t - (t - starttime)/difffreq;
}

function mousedown_rotate(event) {
  rot = setInterval(rotate, 16.6666 /*execute every 100ms*/);   
}

function mouseup_rotate(event) {
  if(rot!=-1) {  //Only stop if exists
    clearInterval(rot);
    rot=-1;
    rotLeft = false;
    rotRight = false;
  }
}

function rotate() {
  if(rotLeft) {
    walk.camera_azimuth -= 2;
  }
  else if(rotRight) {
    walk.camera_azimuth += 2;
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function mousespin(e) {
  var pos = getMousePos(c, e);

  if(mousespindown) {
    spinning = true;
    spindirx = pos.x - lastx;
    spindiry = pos.y - lasty;
    if((spindirx==0)&&(spindiry==0))
    {
      spindirx=1;
    }
    var mag = Math.sqrt(spindirx*spindirx + spindiry*spindiry);
    spindirx = spindirx/mag;
    spindiry = spindiry/mag;
    spin_azimuth_dir = Math.floor(Math.random()*2)-1;
    spinspeed = (Math.PI * (mag/(Math.random()*400+50))) / ((timer.getTimer()-lastmousetime+1));
    //spinspeed = spinspeed * .005;
  }
  lastx = pos.x;
  lasty = pos.y;
  lastmousetime = timer.getTimer(); 
}

function spin_walker(t, cur) {
  lastmatrix = spinmatrix;
  spin_azimuth = (spin_azimuth + spin_azimuth_dir * spinspeed * 0.005)*0.97;

  // spin_distance = Number(Math.sin(cur/3)*100*spinspeed);
  spin_distance = 10000*spinspeed;

  if(Number(walk.camera_distance) + spin_distance < 500)
  {
    spin_distance = spin_distance+(Number(walk.camera_distance)-spin_distance-500);
  }
  rotmatrix = rotateaxis(spinspeed/**(t - (lasttime+starttime))*/,spindiry,spindirx,0);
  spinmatrix = multmatrix(rotmatrix,spinmatrix);
  

  spinspeed = spinspeed*0.96;

  
  vect = multvectormatrix(new Array(0,1,0,0),spinmatrix);
  returnrotation = angleBetween(vect[0],vect[1],vect[2],0,1,0);
  if(Math.abs(returnrotation[3])>0.0001)
  {
    rotdir = Math.abs(returnrotation[3])/returnrotation[3];
      // spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.03, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      if(Math.abs(returnrotation[3])<=0.1){
        spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.1, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }else{
        spinmatrix = multmatrix(rotateaxis(-rotdir*0.01, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }
    }
    
    vect = multvectormatrix(new Array(1,0,0,0),spinmatrix);
    returnrotation = angleBetween(vect[0],vect[1],vect[2],1,0,0);
    if(Math.abs(returnrotation[3])>0.0001)
    {
      rotdir = Math.abs(returnrotation[3])/returnrotation[3];
      // spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.01, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      if(Math.abs(returnrotation[3])<=0.1){
        spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.1, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }else{
        spinmatrix = multmatrix(rotateaxis(-rotdir*0.01, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }
    }
  }

var ctrl = false;

function showCtrl() {
  if(!ctrl){
    jQuery(".controlbar-open").css('right', 280).addClass('active')
    jQuery("#ctrl-text").text("Close");
    jQuery(".controlbar-wrapper").css('right', 0);
    ctrl = true;
  }
  else {
    jQuery(".controlbar-open").css('right', 0).removeClass('active');
    jQuery("#ctrl-text").text("Open");
    jQuery(".controlbar-wrapper").css('right', -280);
    ctrl = false;
  }
}


jQuery(document).ready(function($) {
  
  $("#side-menu").metisMenu({
    activeClass: 'active'
  });
  
});