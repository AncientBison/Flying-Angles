import { moving_background, toggle_moving_background } from './settings.js';

var s1 = document.getElementById("s1")
s1.addEventListener("click",function() {
  toggle_moving_background();
  s1.innerHTML = "Moving background: " + (moving_background ? "Yes" : "No");
  console.log("New value: " + s1.innerHTML);
});
s1.innerHTML = "Moving background: " + (moving_background ? "Yes" : "No");

import { grass, toggle_grass } from './settings.js';
var s2 = document.getElementById("s2")
s2.addEventListener("click",function() {
  toggle_grass();
  s2.innerHTML = "Grass: " + (grass ? "Yes" : "No");
  console.log("New value: " + s2.innerHTML);
});
s2.innerHTML = "Grass: " + (grass ? "Yes" : "No");


import {color, change_color } from './settings.js';
var s3 = document.getElementById("s3")
s3.addEventListener("click",function() {
  change_color();
  s3.innerHTML = "Square Color: " + color;
  console.log("New value: " + s3.innerHTML);
});
s3.innerHTML = "Square Color: " + color;

import { levelnum, levelup, leveldown } from './settings.js'
var s4 = document.getElementById("s4")
s4.addEventListener("click",function(e) {
  if (!e.ctrlKey) {
    levelup()
    s4.innerHTML = "Level Number: " + levelnum
  }
  else if (e.ctrlKey && levelnum > 0) {
    leveldown()
    s4.innerHTML = "Level Number: " + levelnum
  }
});

import { debug, toggle_debug } from './settings.js';
var s5 = document.getElementById("s5")
s5.addEventListener("click",function() {
  toggle_debug();
  s5.innerHTML = "Debug: " + (debug ? "Yes" : "No");
  console.log("New value: " + s5.innerHTML);
});
s5.innerHTML = "Debug: " + (debug ? "Yes" : "No");
