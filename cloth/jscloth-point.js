
function Particle ( pos ) {
  this.previousPosition = pos;
  this.position = pos;
  this.acceleration = new Vec3( 0, 0, 0 );
  this.active = true;
}

Particle.prototype.simulate = function ( dt ) {
  if (!this.active) return;

  var newPos = this.position.scale(1.99).sub( this.previousPosition.scale(0.99) ).add( this.acceleration.scale( dt*dt ) );

  //if ( newPos.y < 0 ) {
  //  newPos.y = 0;
  //}

  this.previousPosition = this.position;
  this.position = newPos;
  this.acceleration.zero();
}

Particle.prototype.accelerate = function ( a ) {
  if (!this.active) return;
  this.acceleration = this.acceleration.add( a );
}

Particle.prototype.velocity = function ( dt ) {
  return this.position.sub( this.previousPosition ).scale( 1 / dt );
}
