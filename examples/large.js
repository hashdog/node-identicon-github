var identicon = require('../');

console.log('<html><head><title>identicons</title></head><body>');
console.log('<h2>large</h2>');

var custom = { pixelSize: 8, pixelPadding: -2, tiles: 30, pixelColor: 0, bgColor: 1 };
for (var i=0; i<10; i++) {
  console.log('<img src="' + identicon(i.toString(), custom).toDataURL() + '">');
}

console.log('</body></html>');
