
function Constraint ( a, b ) {
  this.point1 = a;
  this.point2 = b;
  this.target = a.position.sub(b.position).magnitude();
}

Constraint.prototype.simulate = function ( dt ) {
  var p1 = this.point1.position;
  var p2 = this.point2.position;

  var direction = p2.sub(p1);
  var length = direction.magnitude();
  var factor = (length - this.target) / (length * 2.1);
  var correction = direction.scale( factor );

  if (this.point1.active) {
    this.point1.position = this.point1.position.add( correction );
  }
  if (this.point2.active) {
    this.point2.position = this.point2.position.sub( correction );
  }
}

/*Constraint.prototype.draw = function ( ctx ) {
  var pos1 = this.point1.previousPosition;
  var pos2 = this.point2.previousPosition;
  var deviation = (this.target - pos1.sub(pos2).magnitude()) / this.target;
  var color_diff = Math.round(deviation * deviation * 256);

  ctx.strokeStyle = 'rgba(' + (128+color_diff) + ', ' + (128-color_diff) + ', ' + (128-color_diff) + ', 1)';

  ctx.beginPath();
  ctx.lineWidth = 1/200;
  ctx.moveTo(pos1.x, pos1.y);
  ctx.lineTo(pos2.x, pos2.y);
  ctx.stroke();
}*/
