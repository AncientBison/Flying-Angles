import { startGameLoop } from './gameloop.js';
import { moving_background, grass, color, debug, levelnum,setCookie } from './settings.js';
setCookie("levelnum",1)
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
stop = false
ctx.fillStyle = "#ffffff"
var startx = 15
var ground = 590;
var starty = ground - 50;
var x = startx
var y = starty
var v = 0;
var g = 1.2;//normal 1.2
var back = false
var forward = false
var jump = false
var layers = []
canvas.height = 600
canvas.width = 800
var won = false
var level = "fakelevel()"
var cloudpos = 0
const speed = 7

function printDebug(str) {
  if (debug) {console.log(str)}
}

//file reading
function getlevel(levelnum) {
  $.get("Levels/level" + levelnum + ".txt", function(levelfile) {
    printDebug("Level: " + levelfile)
    level = levelfile
    //the platforms are in a var called level
    eval(level)
  })
}
$(document).ready(getlevel(levelnum));

for(var i = 1;i<=60;i++) {
  layers.push(i);
}

var layer = 3;
var platforms = []

function fakelevel() {
  printDebug("CURRENT STATUS: Level is not defined.")
}

function newPlatform(x,width,y,type = 1) {
  //platform
  var goal = type==2 ? true:false
  var tramp = type==3 ? true:false
  var lava = type==4 ? true:false
  platforms.push({
  xStart : x,
  width: width,
  xEnd : x + width,
  y : y,
  goal : goal,
  tramp : tramp,
  lava : lava
  })
  platforms.sort(function(a, b){return a.y - b.y});
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].platformId = i;
  }
}

function drawPlatforms() {
  for (var i = 0; i < platforms.length; i++) {
    var platform = platforms[i];
    ctx.fillStyle = platform.goal ? "purple" : platform.tramp ? "#24ff5e" : platform.lava ? "#cc2323" :  "#808080";
    ctx.fillRect(platform.xStart, platform.y, platform.width, -10);
    if (debug) {
      ctx.fillStyle = "black"
      ctx.font = "10px Arial";
      ctx.fillText("" + platform.platformId, platform.xStart + (platform.width / 2), platform.y)
    }
  }
}

function getPlatforms() {
  var platforms_at_x = []
  platforms_at_x.push({y:ground, goal:false})
  for(var p = 0;p<platforms.length;p++) {
    var platform = platforms[p]
    if (x >= platform.xStart - 30 && x <= platform.xEnd) {
      platforms_at_x.push(platform)
    }
  }
  return platforms_at_x;
}

function tick() {
  if (moving_background) {
    cloudpos += Math.random()
  }

  var hitLava = false;

  if (back) {
    x = Math.max(x - speed, 0);
    // Figure out if new x is in the middle of a platform;
    // if it is, then x = that platform's xEnd + 1.
    var ys = getPlatforms()
    for (var i = 0;i < ys.length;i++) {
      if (y > ys[i].y - 40 && y < ys[i].y) {
        printDebug("Ran into the right side of platform " + ys[i].platformId)
        x = ys[i].xEnd + 1
        hitLava = ys[i].lava
        break;
      }
    }
  }
  if (forward) {
    x = Math.min(x + speed, canvas.width - 30);
    // Figure out if new x is in the middle of a platform;
    // if it is, then x = that platform's xStart - 1.
    var ys = getPlatforms()
    for (var i = 0;i < ys.length;i++) {
      if (y > ys[i].y - 40 && y < ys[i].y) {
        printDebug("Ran into the left side of platform " + ys[i].platformId)
        x = ys[i].xStart - 30 - 1
        hitLava = ys[i].lava
        break;
      }
    }
  }

  if (jump && v == 0) {v = 15}
  
  var newY = y - v;

  //stoptramp
  if (newY > y) {
    g = 1.2
  }

  var ys = getPlatforms()
  var onPlatform = false
  for(var i=0; i < ys.length; i++) {
    var pY = ys[i].y //PlatformY
    var pG = ys[i].goal //IsGoal
    var pT = ys[i].tramp
    var pL = ys[i].lava
    var platformId = ys[i].platformId;

    // Player landed on platform from above
    if (y < pY - 40 && newY >= pY - 40) {
      v = 0;
      newY = pY - 40;
      printDebug("Landed on platform " + platformId);
      onPlatform = true
      if (pG) {
        printDebug("You Won!")
        won = true
      }
      if (pT) {
        g = 0.9
      }
      hitLava = pL;
      break;
    }

    // Player was on a platform and still is
    if (y == pY - 40 && newY == pY - 40) {
      printDebug("Chillin' on platform " + platformId + ", x=" + x);
      onPlatform = true
      break;
    }
  }

  var hitPlatform = false
  if (!onPlatform) {
    for(var i=ys.length - 1; i >= 0; i--) {
      var pY = ys[i].y //PlatformY
      var platformId = ys[i].platformId;

      // Player hit the platform from below
      if (y > pY - 30 && newY <= pY) {
        printDebug("Hit platform from below " + platformId);
        hitPlatform = true
        hitLava = pL;
        v = 0;
        newY = pY;
        break;
      }
    }
  }

  if (hitLava) {
    x = startx
    y = starty
    v = 0
  } else {
    if (!hitPlatform && !onPlatform) {
      printDebug("Floating!"); 
    }
    y = newY
    if (!onPlatform) {
      v -= g;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Platforms
  drawPlatforms()

  //Sun
  ctx.fillStyle = "#ffff00";
  ctx.beginPath()
  ctx.arc(70, 70, 50, 0, 2 * Math.PI);
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
  //grass cover
  ctx.fillStyle = "#00cdff"
  if (!grass) {
    ctx.fillRect(0,560,canvas.width,21)
  }
  // Character
  ctx.fillStyle = color.toLowerCase();
  ctx.beginPath();
  ctx.moveTo(0+x,0+y);
  ctx.lineTo(30+x,0+y);
  ctx.lineTo(30+x,30+y);
  ctx.lineTo(0+x,30+y)
  ctx.lineTo(0+x,0+y)
  ctx.closePath()
  ctx.stroke();
  ctx.fill()

  //cloud and sky and ground
  canvas.style.backgroundPosition = cloudpos + "px 0px"
  //check if on goal
  if (won) {
    ctx.fillStyle = "black"
    ctx.font = "100px Arial";
    ctx.fillText("You Won!",200, 300);
  }
}
function keypress(e) {  
  if (e.code == "Space") {
  jump = true
  }
  if (e.code == "KeyA") {
    back = true
  }
  if (e.code == "KeyD") {
  forward = true
  }
}
function keyup(e) {
  if (e.code == "Space") {
  jump = false
  }
  if (e.code == "KeyA") {
  back = false
  }
  if (e.code == "KeyD") {
  forward = false
  }
}

document.addEventListener('keypress', keypress);
document.addEventListener('keyup', keyup);

startGameLoop(tick, 30)
