import { startGameLoop } from './gameloop.js';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
stop = false
ctx.fillStyle = "#ffffff"
var x = 150
var ground = 550;
var y = ground;
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
var ys = []

function newPlatform(x,width,y) {
	//platform
	ctx.fillRect(x,y,Math.abs(x - width),10)
	platforms.push({
		xStart : x,
		xEnd : x + width,
		y : y
	})
}

function getPlatform() {
	for(var p = 0;p<platforms.length;p++) {
		var platform = platforms[p]
		if (x >= platform.xStart && x <= platform.xEnd) {
			ys = []
			ys.push(platform.y)
		}
	}
}

function tick() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (jump) {v = 15}
	
	if (newY <= ground) {
		v = 0
	} else {
		getPlatform()
    var newY = Math.min(ground, y - v)
		for(var i=0;i < ys.length;i++) {
			var pY = ys[i]//PlatformY
			var pXS = platforms[i].xStart
			var pXE = platforms[i].xEnd
			for(var yc = y;y<=newY;yc++) {
				for(var u = pXS;u<=pXE;u++) {
					if (x == u && Math.abs(yc) == pY) {
						v = 0
					}
				}
			}
		}
    y = newY
		if (v != 0) {
			v -= g
		}
	}
	if (back) {x -= 7}
	if (forward) {x += 7}
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
	newPlatform(10,100,500);
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