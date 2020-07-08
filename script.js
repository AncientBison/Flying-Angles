import { startGameLoop } from './gameloop.js';
import { moving_background, grass, color, debug, levelnum,setCookie } from './settings.js';
setCookie("levelnum",1)
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
stop = false
ctx.fillStyle = "#ffffff"
var x = 15
var ground = 590;
var y = ground - 50;
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

//file reading
function getlevel(levelnum) {
  $.get("Levels/level" + levelnum + ".txt", function(levelfile) {
    if (debug) console.log(levelfile)
    level = levelfile
  })
}
$(document).ready(getlevel(levelnum));

for(var i = 1;i<=60;i++) {
  layers.push(i);
}

var layer = 3;
var platforms = []

function fakelevel() {
  if (debug) console.log("CURRENT STATUS: Level is not defined.")
}

function newPlatform(x,width,y,type = 1) {
  //platform
  var goal = type==2 ? true:false
  var tramp = type==3 ? true:false
  ctx.fillStyle = goal ? "purple" : tramp ? "#24ff5e" : "#808080"
  ctx.fillRect(x, y, width, -10)
  platforms.push({
  xStart : x,
  xEnd : x + width,
  y : y,
  goal : goal,
  tramp : tramp
  })
  platforms.sort(function(a, b){return a.y - b.y});
}

function getPlatforms() {
  var platforms_at_x = []
  platforms_at_x.push({y:ground, goal:false})
  for(var p = 0;p<platforms.length;p++) {
  var platform = platforms[p]
  if (x >= platform.xStart - 30 && x <= platform.xEnd) {
      platforms_at_x.push({y:platform.y, goal:platform.goal,tramp:platform.tramp})
      if (debug) console.log(platform.y)
  }
  }
  return platforms_at_x;
}

function tick() {
  if (moving_background) {
    cloudpos += Math.random()
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (back) {x -= 7}
  if (forward) {x += 7}


  if (jump && v == 0) {v = 15}
  
  var newY = y - v;
  var ys = getPlatforms()
  var onPlatform = false
  for(var i=0; i < ys.length; i++) {
    var pY = ys[i].y //PlatformY
    var pG = ys[i].goal //IsGoal
    var pT = ys[i].tramp

    //stoptramp
    if (newY > y) {
      g = 1.2
    }

    // Player landed on platform from above
    if (y < pY - 40 && newY >= pY - 40) {
      v = 0;
      newY = pY - 40;
      onPlatform = true
      if (pG) {
        console.log("You Won!")
        won = true
      }
      if (pT) {
        g = 0.9
      }
      break;
    }

    // Player was on a platform and still is
    if (y == pY - 40 && newY == pY - 40) {
      onPlatform = true
      break;
    }

    // Player hit the platform from below
    if (y > pY - 30 && newY <= pY) {
      v = 0;
      newY = pY + 1;
      break;
    }
  }

  y = newY
  if (!onPlatform) {
    v -= g;
  }
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
  //the platforms are in a var called level
  eval(level)
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