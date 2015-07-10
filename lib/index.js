'use strict';

var crypto = require('crypto'),
    Canvas = require('canvas'),
    _ = require('lodash');

var bu = require('./bufutil'),
    unpack = require('./unpack'),
    bright = require('./bright');

var fprint = function(buf, len) {
  if (len > 64) {
    throw new Error('sha512 can only generate 64B of data: ' + len + 'B requested');
  }

  return _(crypto.createHash('sha512').update(buf).digest())
    .groupBy(function (x, k) { return Math.floor(k/len); })
    .reduce(bu.xor);
};

var idhash = function(str, n, minFill, maxFill) {
  var buf = new Buffer(str.length + 1);
  buf.write(str);

  for (var i=0; i<0x100; i++) {
    buf[buf.length - 1] = i;
    var f = fprint(buf, Math.ceil(n/8)+6);

    var pixels = _(f.slice(6))
      .map(function (x) { return unpack(x); })
      .flatten()
      .take(n);

    var setPixels = pixels.filter().size();

    var c = [ f.slice(0, 3), f.slice(3, 6)];
    c.sort(bright.cmp);

    if (setPixels > (minFill * n) && setPixels < (maxFill * n)) {
      return {
        colors: c.map(function (x) { return x.toString('hex'); }),
        pixels: pixels.value()
      };
    }
  }

  throw new Error('String "' + str + '" unhashable in single-byte search space.');
};


var reflect = function(id, dimension) {
  var mid = Math.ceil(dimension / 2);
  var odd = Boolean(dimension % 2);

  var pic = [];
  for (var row=0; row<dimension; row++) {
    pic[row] = [];

    for (var col=0; col<dimension; col++) {
      var p = (row * mid) + col;
      if (col>=mid) {
        var d = mid - (odd ? 1 : 0) - col;
        var ad = Math.abs(d);
        p = (row * mid) + mid - 1 - ad;
      }
      pic[row][col] = id.pixels[p];
    }
  }

  return pic;
};

var identicon = function(str, opts) {
  opts = _.merge({}, identicon.defaults, opts);

  var dimension = opts.tiles,
      pixelSize = opts.pixelSize,
      border = opts.pixelPadding;

  var mid = Math.ceil(dimension / 2),
      id = idhash(str, mid * dimension, opts.minFill, opts.maxFill),
      pic = reflect(id, dimension),
      csize = (pixelSize * dimension) + (opts.imagePadding * 2),
      c = new Canvas(csize, csize),
      ctx = c.getContext('2d');

  if (_.isString(opts.bgColor)) {
    ctx.fillStyle = opts.bgColor;
  } else if (_.isNumber(opts.bgColor)) {
    ctx.fillStyle = '#' + id.colors[opts.bgColor];
  }

  if ( ! _.isNull(opts.bgColor)) {
    ctx.fillRect(0, 0, csize, csize);
  }

  var drawOp = ctx.fillRect.bind(ctx);

  if (_.isString(opts.pixelColor)) {
    ctx.fillStyle = opts.pixelColor;
  } else if (_.isNumber(opts.pixelColor)) {
    ctx.fillStyle = '#' + id.colors[opts.pixelColor];
  } else {
    drawOp = ctx.clearRect.bind(ctx);
  }

  for (var x=0; x<dimension; x++) {
    for (var y=0; y<dimension; y++) {
      if (pic[y][x]) {
        drawOp((x*pixelSize) + border + opts.imagePadding,
              (y*pixelSize) + border + opts.imagePadding,
              pixelSize - (border * 2),
              pixelSize - (border * 2));
      }
    }
  }

  return c;
};

identicon.defaults = {
  bgColor: null,
  imagePadding: 0,
  maxFill: 0.90,
  minFill: 0.3,
  pixelColor: 0,
  pixelPadding: 0,
  pixelSize: 10,
  tiles: 5
};

identicon.style = {
  github: {
    bgColor: '#F0F0F0',
    imagePadding: 35,
    pixelPadding: -1,
    pixelSize: 70,
    tiles: 5
  },
  gravatar: {
    bgColor: 1,
    tiles: 8
  },
  mono: {
    bgColor: '#F0F0F0',
    imagePadding: 6,
    pixelColor: '#000000',
    pixelPadding: -1,
    pixelSize: 12,
    tiles: 6
  },
  mosaic: {
    bgColor: '#F0F0F0',
    imagePadding: 2,
    pixelPadding: 1,
    pixelSize: 16
  },
  mini: {
    bgColor: 0,
    pixelColor: 1,
    pixelPadding: 1,
    pixelSize: 10,
    tiles: 3
  },
  window: {
    bgColor: 0,
    imagePadding: 2,
    pixelColor: null,
    pixelPadding: 1,
    pixelSize: 16
  }
};

module.exports = identicon;
