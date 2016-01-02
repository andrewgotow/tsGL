class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor( r: number, g: number, b: number, a: number ) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static add ( a: Color, b: Color ): Color {
    return new Color( a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a );
  }

  static sub ( a: Color, b: Color ): Color {
    return new Color( a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a );
  }

  static multiply ( a: Color, b: Color ): Color {
    return new Color( a.r * b.r, a.g * b.g, a.b * b.b, a.a * b.a );
  }

}
