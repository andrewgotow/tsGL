/// <reference path="./texture.ts"/>

class Cubemap extends Texture {

  constructor () {
    super();
  }

  static fromFiles ( urls: string[] ) : Cubemap {
    var tex = new Cubemap();
    tex.textureId = GL.context.createTexture();

    GL.context.bindTexture( GL.context.TEXTURE_CUBE_MAP, tex.textureId );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_MAG_FILTER, GL.context.LINEAR );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_MIN_FILTER, GL.context.LINEAR );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_WRAP_S, GL.context.CLAMP_TO_EDGE );
    GL.context.texParameteri( GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_WRAP_T, GL.context.CLAMP_TO_EDGE );

    var numLoaded = 0;
    for ( var i = 0; i < 6; i ++ ) {
      (function () {
        var img = new Image();
        var face = Cubemap._targetForFace(i);

        // This is wrapped in a function because loops in Javascript don't actually
        // maintain their own scope. the "face" variable was shared across ALL instances,
        // so by encapsulating it here, we can actually maintain a scope for our function.
        (function (face : number) {
          img.onload = function() {
            GL.context.bindTexture( GL.context.TEXTURE_CUBE_MAP, tex.textureId );
            GL.context.texImage2D( face, 0, GL.context.RGBA, GL.context.RGBA, GL.context.UNSIGNED_BYTE, img );

            if ( ++ numLoaded == 6 ) {
              tex.ready = true;
              tex.onReady( tex );
            }
          }
        })(face);
        
        img.src = urls[i];
      })();

    }

    return tex;
  }

  private static _targetForFace ( index: number ) {
    switch( index ) {
      case 0: return GL.context.TEXTURE_CUBE_MAP_POSITIVE_X;
      case 1: return GL.context.TEXTURE_CUBE_MAP_NEGATIVE_X;
      case 2: return GL.context.TEXTURE_CUBE_MAP_POSITIVE_Y;
      case 3: return GL.context.TEXTURE_CUBE_MAP_NEGATIVE_Y;
      case 4: return GL.context.TEXTURE_CUBE_MAP_POSITIVE_Z;
      default: return GL.context.TEXTURE_CUBE_MAP_NEGATIVE_Z;
    }
  }

}
