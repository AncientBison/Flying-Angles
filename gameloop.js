//This is the gameloop lib made by AncientBison and Orrb
//To run this code add the atribute type="module" to your script element in the html and write import { startGameLoop } from './gameloop.js'; in your js then run the function startGameLoop(function,ticksPerSecond).
stop = false;
var tick_function = null;
var tps = 30;
var nextTick = -1;

export function startGameLoop(_tick_function, _tps) {
	stop = false;
	tick_function = _tick_function;
	tps = _tps;
	_gameLoop();
}

function stopGameLoop() {
	stop = true;
}

function _gameLoop() {
	if (stop) {
		return;
	}
	tick_function();
	// Schedule game tick
	if (nextTick < 0) {
		nextTick = new Date().getTime();
	}
	nextTick += 1000/tps;
	setTimeout(
		_gameLoop,
	  Math.max(0, nextTick - new Date().getTime()));
}

function escape(e) {	
	if (e.code == "Escape") {
		stop = true;
	}
}

document.addEventListener('keypress', escape);