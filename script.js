     import { startGameLoop } from './gameloop.js';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
stop = false
ctx.fillStyle = "#ffffff"
var x = 15
var ground = 590;
var y = ground - 50;
var v = 0;
const g = 1.2;//normal 1.2
var back = false
var forward = false
var jump = false
var layers = []
canvas.height = 600
canvas.width = 800
var won = false
var level = "fakelevel()"

//file reading
function getlevel(levelnum) {
  $.get("Levels/level" + levelnum + ".txt", function(levelfile) {
    console.log(levelfile)
    level = levelfile
  })
}
$(document).ready(getlevel(1));

for(var i = 1;i<=60;i++) {
  layers.push(i);
}

var layer = 3;
var platforms = []

function fakelevel() {
  console.log("CURRENT STATUS: Level is not defined.")
}

function newPlatform(x,width,y,goal=false) {
  //platform
  ctx.fillStyle = goal ? "purple" : "#808080"
  ctx.fillRect(x, y, width, -10)
  platforms.push({
  xStart : x,
  xEnd : x + width,
  y : y,
  goal : goal
  })
  platforms.sort(function(a, b){return a.y - b.y});
}

function getPlatforms() {
  var platforms_at_x = []
  platforms_at_x.push({y:ground, goal:false})
  for(var p = 0;p<platforms.length;p++) {
  var platform = platforms[p]
  if (x >= platform.xStart - 30 && x <= platform.xEnd) {
      platforms_at_x.push({y:platform.y, goal:platform.goal})
      //console.log(platform.y)
  }
  }
  return platforms_at_x;
}

function tick() {
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

    // Player landed on platform from above
    if (y < pY - 40 && newY >= pY - 40) {
      v = 0;
      newY = pY - 40;
      onPlatform = true
      if (pG) {
        console.log("You Won!")
        won = true
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

  // Arrow
  ctx.fillStyle = "#ff00ff";
  ctx.beginPath();
  ctx.moveTo(0+x,0+y);
  ctx.lineTo(30+x,0+y);
  ctx.lineTo(30+x,30+y);
  ctx.lineTo(0+x,30+y)
  ctx.lineTo(0+x,0+y)
  ctx.closePath()
  ctx.stroke();
  ctx.fill()
  //Ground
  ctx.fillStyle = "#4d8204";
  ctx.fillRect(0, 580, canvas.width, 20)
  //the platforms are in a var called level
  eval(level)
  //Sun
  ctx.fillStyle = "#ffff00";
  ctx.arc(70, 70, 50, 0, 2 * Math.PI);
  ctx.fill()
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

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    console.log("this function was called!")
    this.sound.play();
    console.info("i played song")
  }
  this.stop = function(){
    this.sound.pause();
  }    
}

function playBgSound() {
    console.log("this function was called 2!")
  var bgmusic = new sound("https://github.com/AncientBison/FlyingSquaresMusic/blob/master/%5BOLD%5DAll%20Bee%20Swarm%20Simulator%20songs-%5BAudioTrimmer.com%5D.mp3")
  bgmusic.play();
}

document.addEventListener('keypress', keypress);
document.addEventListener('keyup', keyup);

playBgSound();
startGameLoop(tick, 30)