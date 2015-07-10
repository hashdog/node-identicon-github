var identicon = require('../'),
    img = identicon('kibo', { pixelSize: 16 }).toDataURL();

console.log('<img alt="kibo" src="' + img + '" />');
