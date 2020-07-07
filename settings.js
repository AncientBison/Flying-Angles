function setCookie(cname, cvalue, session_only=false) {
  var expires = "";
  if (!session_only) {
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = ";expires="+d.toUTCString();
  }
  document.cookie = cname + "=" + cvalue + expires + ";path=/";
}
export { setCookie }

function getCookie(cname, default_value) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return default_value;
}

levelnum = 1

var moving_background = eval(getCookie("moving_background", "true"))
function toggle_moving_background() {
  moving_background = !moving_background;
  setCookie("moving_background", moving_background);
}
export { moving_background, toggle_moving_background };

var grass = eval(getCookie("grass", "true"))
function toggle_grass() {
  grass = !grass;
  setCookie("grass", grass);
}
export { grass, toggle_grass };

var colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"]
var color = getCookie("color", colors[0]);
function change_color() {
  color = colors[(colors.indexOf(color) + 1) % colors.length];
  setCookie("color", color);
}
export { color, change_color };

var debug = eval(getCookie("debug", "false"));
function toggle_debug() {
  debug = !debug;
  setCookie("debug", debug, true);
}
export { debug, toggle_debug };

var levelnum = eval(getCookie("levelnum","1"))
function levelup() {
  levelnum += 1
  setCookie("levelnum",levelnum)
}
function leveldown() {
  levelnum -= 1
  setCookie("levelnum",levelnum)
}
export { levelnum, levelup, leveldown }