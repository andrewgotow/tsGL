Texture.prototype = new Asset();
Texture.prototype.constructor = Texture;
function Texture ( url ) {
  this.url = url;
  this._texture = null; // the OpenGL resource ID for this texture.

  this._load();
}

Texture.prototype._load = function () {
  var tex = this._texture = gl.createTexture();

  var img = new Image();
  img.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  img.src = this.url;
}

Texture.prototype._unload = function () {
  gl.deleteTexture( this._texture );
}

Texture.prototype.getTextureId = function () {
  if ( this._texture == null )
    console.error( "Attempting to use Texture asset before it has been loaded.")
  return this._texture;
}

Texture.prototype.ready = function () {
  return this._texture != null;
}
