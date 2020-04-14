import { startGameLoop } from './gameloop.js';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
stop = false
ctx.fillStyle = "#ffffff"
var x = 100
const ground = 550;
var y = ground;
var v = 0;
const g = 1.2;

//ctx.translate(x,y);
//ctx.rotate(180 * Math.PI / 180);
//ctx.translate(-x,-y);
//ctx.beginPath();
//ctx.moveTo(0+x,0+y);
//ctx.lineTo(30+x,15+y);
//ctx.lineTo(0+x,30+y);
//ctx.lineTo(3.75+x,15+y)
//ctx.lineTo(0+x,0+y)
//ctx.closePath()
//ctx.stroke();
//ctx.fill()

function tick() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	y = Math.min(ground, y - v)
	if (y == ground) {
		v = 0
	} else {
		v -= g
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
	//Sun
	ctx.fillStyle = "#ffff00";
	ctx.arc(70, 70, 50, 0, 2 * Math.PI);
	ctx.fill()
}

function jump() {
	v = 15;
}
function keypress(e) {	
	if (e.code == "Space") {
		jump()
	}
}
document.addEventListener('keypress', keypress);

startGameLoop(tick, 30);
