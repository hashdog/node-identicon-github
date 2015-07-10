'use strict';

// Inspired by:
// https://code.google.com/p/nodejs-win/source/browse/node_modules/mysql/lib/auth.js
var xor = function(a, b) {
  var n = Math.min(a.length, b.length),
      m = Math.max(a.length, b.length),
      out = new Buffer(m),
      longer = (a.length > b.length ? a : b) ;

  for (var i=0; i<n; i++) {
    out[i] = (a[i] ^ b[i]);
  }

  for (var i=n; i<m; i++) {
    out[i] = longer[i];
  }

  return out;
};

module.exports = {
  xor: xor
};
