/**
 * Module dependencies
 */
var raf = require('raf');;
var inherit = require('inherit');
var grid = require('component-grid');

/**
 * Canvas base fn prototype
 *
 * @api private
 */
function Canvas(){
}


/**
 * Create new canvas with `width` and `height`
 *
 * @param {Number} width
 * @param {Number} height
 * @api public
 */
Canvas.prototype.createCanvas = function(width, height){
  this.el = document.createElement('canvas');
  this.el.className = 'component-animate-cubic-bezier-curve';
  this.ctx = this.el.getContext('2d');
  this.el.width = width;
  this.el.height = height;
  document.body.appendChild(this.el);
};

/**
 * Grid that sits below the animation
 *
 * @api private
 */
function Grid(){
}

/**
 * Inherits from `Canvas.prototype`.
 */
inherit(Grid, Canvas);


/**
 * Draw the base grid and lines ab, bc on a new canvas
 *
 * @api public
 */
Grid.prototype.draw = function(){
  
  if (this.el) return;
  
  var that = this;
  this.createCanvas(this.parent.canvas.width, this.parent.canvas.height);
  
  // lines
  this.ctx.fillStyle = this.ctx.strokeStyle = this.parent.backgroundStrokeStyle;

  this.ctx.save();
  this.ctx.globalAlpha = 0.4;
  grid(0.5, this.el.width, this.el.height, 0.5)
    .draw(this.el);
  this.ctx.restore();

  // diagonal: joins points a, b, c, d
  this.ctx.beginPath();
  this.ctx.moveTo(this.parent.ax, this.parent.ay);
  this.ctx.lineTo(this.parent.bx, this.parent.by);
  this.ctx.lineTo(this.parent.cx, this.parent.cy);
  this.ctx.lineTo(this.parent.dx, this.parent.dy);
  this.ctx.stroke();
  
  // points
  this.ctx.beginPath();
  [
    [this.parent.ax, this.parent.ay],
    [this.parent.bx, this.parent.by],
    [this.parent.cx, this.parent.cy],
    [this.parent.dx, this.parent.dy],
  ].forEach(function(set){
    that.ctx.beginPath();
    that.ctx.arc(set[0], set[1], 5, 2 * Math.PI, false);
    that.ctx.fill();
  });

};


/**
 * Line joining midpoints of ab, bc and cd
 *
 * @api private
 */
function Line(){
};


/**
 * Inherits from `Canvas.prototype`.
 */
inherit(Line, Canvas);


/**
 * Draw the line a new canvas
 *
 * @api public
 */
Line.prototype.draw = function(){

  var that = this;

  if (!this.el) this.createCanvas(
    this.parent.canvas.width,
    this.parent.canvas.height
  );
  this.ctx.clearRect(0, 0, this.el.width, this.el.height);
  this.ctx.strokeStyle = this.ctx.fillStyle = this.parent.backgroundStrokeStyle;
  
  // points
  this.ctx.beginPath();
  [
    [this.parent.abx, this.parent.aby],
    [this.parent.bcx, this.parent.bcy],
    [this.parent.cdx, this.parent.cdy]
  ].forEach(function(set){
    that.ctx.beginPath();
    that.ctx.arc(set[0], set[1], 5, 2 * Math.PI, false);
    that.ctx.fill();
  });
  that.ctx.beginPath();
  this.ctx.arc(this.parent.t1x, this.parent.t1y, 5, 2 * Math.PI, false);
  that.ctx.fill();
  
  that.ctx.beginPath();
  this.ctx.arc(this.parent.t2x, this.parent.t2y, 5, 2 * Math.PI, false);
  that.ctx.fill();

  that.ctx.beginPath();
  this.ctx.arc(this.parent.tx, this.parent.ty, 5, 2 * Math.PI, false);
  that.ctx.fill();
  
  // join a-b and b-c points
  this.ctx.beginPath();
  this.ctx.lineWidth = 1;
  this.ctx.moveTo(this.parent.abx, this.parent.aby);
  this.ctx.lineTo(this.parent.bcx, this.parent.bcy);
  this.ctx.lineTo(this.parent.cdx, this.parent.cdy);
  //
  this.ctx.moveTo(this.parent.t1x, this.parent.t1y);
  this.ctx.lineTo(this.parent.t2x, this.parent.t2y);
  this.ctx.stroke();
  
};


/**
 * Curve that moves back and forth between a and d
 *
 * @api private
 */
function Curve(){
}

/**
 * Inherits from `Canvas.prototype`.
 */
inherit(Curve, Canvas);


/**
 * Draw the curve on a new canvas
 *
 * @api public
 */
Curve.prototype.draw = function(){
  var that = this;
  if (!this.el){
    this.createCanvas(
      this.parent.canvas.width,
      this.parent.canvas.height
    );
    this.ctx.beginPath();
    this.ctx.moveTo(this.parent.ax, this.parent.ay);
    this.ctx.strokeStyle = this.parent.foregroundStrokeStyle;
  }
  if (this.parent.t > 1 || this.parent.t < 0) {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
    this.ctx.beginPath();
  }
  this.ctx.lineTo(this.parent.tx, this.parent.ty);
  this.ctx.stroke();
};


/**
 * Initialize a new Animation with ax, ay, bx, by, cx, cy, dx, dy as 
 *
 * ctx.moveTo(ax, ay);
 * ctx.bezierCurveTo(bx, by, cx, cy, dx, dy);
 *
 * @api public
 */
function Animation(ax, ay, bx, by, cx, cy, dx, dy){

  if (!(this instanceof Animation)) return new Animation(ax, ay, bx, by, cx, cy, dx, dy);

  var that = this;

  this.ax = ax;
  this.ay = ay;
  this.bx = bx;
  this.by = by;
  this.cx = cx;
  this.cy = cy;
  this.dx = dx;
  this.dy = dy;
  
  this.grid = new Grid;
  this.line = new Line;
  this.curve = new Curve;

  this.ease();

};


/**
 * Set the stroke style, which the animation will use
 *
 * @param {String} color
 * @return {Animation} this
 * @api public
 */
Animation.prototype.color = function(color){
  this.foregroundStrokeStyle = color;
  return this;
};


/**
 * Update the the animation params
 *
 * @api private
 */
Animation.prototype.update = function(){
  // timer
  this.t = this.t || 0;
  // animation direction
  this.direction = this.direction || 1;
  if (this.t > 1 || this.t < 0) {
    this.direction *= -1;
  }
  this.t += 0.01 * this.direction;

  // ab midpoint
  this._ease('abx', 'ax', (this.bx - this.ax) * this.t);
  this._ease('aby', 'ay', (this.by - this.ay) * this.t);
  // bc midpoint
  this._ease('bcx', 'bx', (this.cx - this.bx) * this.t);
  this._ease('bcy', 'by', (this.cy - this.by) * this.t);
  // cd midpoint
  this._ease('cdx', 'cx', (this.dx - this.cx) * this.t);
  this._ease('cdy', 'cy', (this.dy - this.cy) * this.t);
  // abc midpoint
  this._ease('t1x', 'abx', (this.bcx - this.abx) * this.t);
  this._ease('t1y', 'aby', (this.bcy - this.aby) * this.t);
  // bcd midpoint
  this._ease('t2x', 'bcx', (this.cdx - this.bcx) * this.t);
  this._ease('t2y', 'bcy', (this.cdy - this.bcy) * this.t);
  // t1-t2 midpoint
  this._ease('tx', 't1x', (this.t2x - this.t1x) * this.t);
  this._ease('ty', 't1y', (this.t2y - this.t1y) * this.t);

};


/**
 * Set easing `func`.
 * http://upshots.org/actionscript/jsas-understanding-easing
 * 
 * @param {Function} func
 */
Animation.prototype.ease = function(func){
  this.easingFunc = func || function(t, b, c, d){
    return b + c * 1;
  }
  return this;
};


/**
 * Ease
 */
Animation.prototype._ease = function(a, b, c){
  this[a] = this.easingFunc(this.t, this[b], c, 1);
};


/**
 * Initialize animation using `canvas` properties
 *
 * @param {Canvas} canvas
 * @api public
 */
Animation.prototype.draw = function(canvas) {
  var that = this;
  canvas.className = 'component-animate-cubic-bezier-curve';
  var ctx = canvas.getContext('2d');
  this.canvas = canvas;
  this.backgroundStrokeStyle = ctx.strokeStyle || '#ddd';
  this.foregroundStrokeStyle = this.foregroundStrokeStyle || 'deepskyblue';
  (function animate() {
    raf(animate);
    that.update();
    ['grid', 'line', 'curve'].forEach(function(canvas){
      var canvas = that[canvas];
      canvas.parent = canvas.parent || that;
      canvas.draw();
    });
  })();
};

/**
 * Expose `Animation`.
 */
module.exports = Animation;
