import { startGameLoop } from './gameloop.js';
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
stop = false
ctx.fillStyle = "#ffffff"
var x = 150
var ground = 590;
var y = ground - 40;
var v = 0;
const g = 1.2;
var back = false
var forward = false
var jump = false
var layers = []
for(var i = 1;i<=60;i++) {
	layers.push(i);
}
var layer = 3;
var platforms = []

function newPlatform(x,width,y) {
	//platform
	ctx.fillRect(x, y, width, -10)
	platforms.push({
		xStart : x,
		xEnd : x + width,
		y : y
	})
}

function getPlatform() {
  var ys = []
  ys.push(ground)
	for(var p = 0;p<platforms.length;p++) {
		var platform = platforms[p]
		if (x >= platform.xStart - 30 && x <= platform.xEnd - 5) {
      ys.push(platform.y)
      //console.log(platform.y)
		}
	}
  ys.sort(function(a, b){return a - b});
  return ys;
}

function tick() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (back) {x -= 7}
	if (forward) {x += 7}

	if (jump) {v = 15}
	
  var newY = y - v;
  var ys = getPlatform()
  var onPlatform = false
  for(var i=0; i < ys.length; i++) {
    var pY = ys[i] //PlatformY

    // Player landed on platform from above
    if (y < pY - 40 && newY >= pY - 40) {
      v = 0;
      newY = pY - 40;
      onPlatform = true
      break;
    }

    // Player was on a platform and still is
    if (y == pY - 40 && newY == pY - 40) {
      onPlatform = true
      break;
    }

    // Player hit the platform from below
    if (y > pY && newY <= pY) {
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
	ctx.lineTo(30+x,15+y);
	ctx.lineTo(0+x,30+y);
	ctx.lineTo(3.75+x,15+y)
	ctx.lineTo(0+x,0+y)
	ctx.closePath()
	ctx.stroke();
	ctx.fill()
	//Ground
	ctx.fillStyle = "#4d8204";
	ctx.fillRect(0, 580, canvas.width, 20)
	newPlatform(50,100,500);
	//Sun
	ctx.fillStyle = "#ffff00";
	ctx.arc(70, 70, 50, 0, 2 * Math.PI);
	ctx.fill()
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
	if (e.code == "KeyD") {
		forward = false
	}
	if (e.code == "KeyA") {
		back = false
	}
	if (e.code == "Space") {
		jump = false
	}
}

document.addEventListener('keypress', keypress);
document.addEventListener('keyup', keyup);


startGameLoop(tick, 30);