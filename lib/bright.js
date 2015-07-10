'use strict';

var brightness = function(r, g, b) {
  var br = 0.241 * r * r,
      bg = 0.691 * g * g,
      bb = 0.068 * b * b;

  // http://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  return Math.sqrt(br + bg + bb);
};

var cmp_brightness = function(a, b) {
  return brightness(a[0], a[1], a[2]) - brightness(b[0], b[1], b[2]);
};

var rcmp_brightness = function(a, b) {
  return cmp_brightness(b, a);
};

module.exports = {
  ness: brightness,
  cmp: cmp_brightness,
  rcmp: rcmp_brightness
};
