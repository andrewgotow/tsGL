var scene = null;

function start () {
  scene = new Scene();
  scene.addSystem( new System() );
  scene.addSystem( new Renderer() );

  var entity = new Entity();
  var renderable = new Renderable();
  renderable.material = new Material( new Shader("test", "./assets/shaders/test.vert", "./assets/shaders/test.frag") );
  renderable.mesh = new Mesh( "./assets/models/cube.obj" );
  entity.addComponent( renderable );
  scene.addEntity( entity );

  var camera = new Entity();
  camera.addComponent( new Camera( 60, new Vec3( 100, 100, 0 ) ) );
  camera.getComponent( "Transform" ).position.z = -5;
  scene.addEntity( camera );

  //var texture = new Texture("./assets/textures/testTexture.png");

  scene.startup();
  scene.update( 0.0 );
  //setInterval( function(){scene.update(0.1)}, 100 );
}
