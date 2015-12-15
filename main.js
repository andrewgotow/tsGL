
var cloth = null;
var scene = null;
//var mesh = null;

function start () {
  scene = new Scene();
  scene.camera.projection = Mat4.perspective( 70, 1.33, 0.01, 10 );
  //scene.camera.position = new Vec3( 1.0, 1.0, 1.0 );
  //scene.camera.rotation = new Vec3( 0, 45, 0 );

  /*
  mesh = new Mesh([
    -1, 0, 0,
    0, 1, 0,
    1, 0, 0
  ], new Shader("lambert") );
  scene.nodes.push( mesh );
  */

  cloth = new Cloth( 1, 1, 15, 15, new Shader("test") );
  scene.nodes.push( cloth );

  setInterval( function(){update(0.03)}, 30 );
  //setInterval( function(){update(0.1)}, 100 );
}

var time = 0;
function update ( dt ) {
  time += dt;

  cloth.step( dt );
  scene.draw();
}
