/* Initialize and declare all variables */
var walk = new Walker();

var c, cc;
var timer, starttime, curtime, timediff, lastmousetime;

var speedslider = document.getElementById('speedslider');
var gravityslider = document.getElementById('gravityslider');
var playbackspeedslider = document.getElementById('playbackspeedslider');
var btnreset = document.getElementById('btnreset');
var pauseswitch = document.getElementById('pauseswitch');
var linesswitch = document.getElementById('linesswitch');

// Not using these currently 
var colorpicker = document.getElementById('colorpicker');
var dotsizeslider = document.getElementById('dotsizeslider');

var paused = false;
var lines = false;

var lastx = 0;
var lasty = 0;
var lastmousetime;

var done = false;
/* end of variable initialization */

window.onload = function () {
  reset_controls();
  init();
  setInterval(update, 1000 / 60);
}

function Timer(init, precision) {
  var start = time = new Date(init || null).valueOf(),
    precision = precision || 10;

  setInterval(function () { time += precision; }, precision);

  this.getTimer = function () { return time - start; };
  this.getDate = function () { return new Date(time); };
  this.setTimer = function (t) { time = new Date(t).valueOf(); }
}

function init() {
  c = document.getElementById('wc');
  cc = c.getContext('2d');

  timer = new Timer();
  starttime = timer.getTimer();
  lasttime = starttime;
  lastmousetime = timer.getTimer();

  init_walker();

  btnreset.addEventListener("click", function () {
    timer.setTimer(0);
    init_walker();
    reset_controls();
    if (paused) { paused = false; }
  }, false);

  pauseswitch.addEventListener("change", function () {
    if (!paused) {
      lasttime = timer.getTimer();
      paused = true;
    }
    else {
      timer.setTimer(lasttime);
      paused = false;
    }
  });

  linesswitch.addEventListener("change", function () {
    walk.walker_sticks = !walk.walker_sticks;
    lines = !lines;
  });


  speedslider.addEventListener("input", function () {
    change_controls();
  }, false);

  gravityslider.addEventListener("input", function () {
    change_controls();
  }, false);

  playbackspeedslider.addEventListener("input", function () {
    change_controls();
  }, false);

}

function update() {
  if (!paused) {
    cc.fillStyle = 'white';
    cc.fillRect(0, 0, c.width, c.height);

    curtime = timer.getTimer() - starttime;

    walk.drawWalker(curtime);
  }
}

function init_walker() {
  //lines = false;
  walk = new Walker();
  walk.ctx = cc;
  walk.walker_size = 10;
  walk.dotsize = 3;
  walk.offsetx = c.width / 2;
  walk.offsety = c.height / 2-30; //-30=offset for floor
  //handleResize();

  walk.init();
  walk.walker_sticks = false;

}

function reset_controls() {
  speedslider.value = 3;
  gravityslider.value = 2;
  playbackspeedslider.value = 1;

  linesswitch.checked = false;
  pauseswitch.checked = false;
}

function change_controls() {
  walk.walker_speed = speedslider.value;
  walk.walker_gravity = gravityslider.value;
  walk.walker_PlaybackSpeed = playbackspeedslider.value;
  walk.init();
}


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

jQuery(document).ready(function ($) {

  $("#side-menu").metisMenu({
    activeClass: 'active'
  });

});