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

  static fromHex ( hex: string ): Color {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt( result[1], 16 ) / 255.0;
    var g = parseInt( result[2], 16 ) / 255.0;
    var b = parseInt( result[3], 16 ) / 255.0;

    return new Color( r, g, b, 1.0 );
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
