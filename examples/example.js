var identicon = require('../');
var fmt = require('util').format;


console.log('<html><head><title>identicons</title></head><body>');

console.log('<div><h2>default</h2>');
for (var i=0; i<10; i++) {
	console.log(fmt("<img src='%s' />", identicon(i.toString()).toDataURL()));
}

console.log('<h2>mini</h2>');
for (var i=0; i<10; i++) {
	console.log("<img src='" + identicon(i.toString(), identicon.style.mini).toDataURL() + "'>");
}

console.log('<h2>gravatar-style</h2>');
for (var i=0; i<10; i++) {
	console.log("<img src='" + identicon(i.toString(), identicon.style.gravatar).toDataURL() + "'>");
}

console.log('<h2>monochrome</h2>');
for (var i=0; i<10; i++) {
	console.log("<img src='" + identicon(i.toString(), identicon.style.mono).toDataURL() + "'>");
}

console.log('<h2>mosaic</h2>');
for (var i=0; i<10; i++) {
	console.log("<img src='" + identicon(i.toString(), identicon.style.mosaic).toDataURL() + "'>");
}

console.log('<h2>window</h2>');
for (var i=0; i<10; i++) {
	console.log("<img src='" + identicon(i.toString(), identicon.style.window).toDataURL() + "'>");
}

console.log('<h2>github-style</h2>');
for (var i=0; i<10; i++) {
	console.log("<img src='" + identicon(i.toString(), identicon.style.github).toDataURL() + "'>");
}

console.log('</body></html>');
