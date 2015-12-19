function Color ( r, g, b, a ) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

Color.add = function ( a, b ) {
  checkTypes( [a,b], ["Color","Color"] );
  return new Color( a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a );
}

Color.sub = function ( a, b ) {
  checkTypes( [a,b], ["Color","Color"] );
  return new Color( a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a );
}

Color.multiply = function ( a, b ) {
  checkTypes( [a,b], ["Color","Color"] );
  return new Color( a.r * b.r, a.g * b.g, a.b * b.b, a.a * b.a );
}
