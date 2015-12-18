var scene = null;
var body = null;
var helmet = null;
var updateInterval = null;
var camera = null;
function start () {
  scene = new Scene();
  scene.addSystem( new System() );
  scene.addSystem( new Renderer() );

  body = new Entity();
  var bodyRenderable = new Renderable();
  bodyRenderable.material = new Material( new Shader("body shader", "./assets/shaders/test.vert", "./assets/shaders/test.frag") );
  bodyRenderable.mesh = new Mesh( "./assets/models/excalibur_body.obj" );
  bodyRenderable.material.properties["uMainTex"] = new Texture( "./assets/textures/ExcaliburBody_Diffuse.png" );
  body.addComponent( bodyRenderable );

  body.getComponent( "Transform" ).position.y = -1.0;
  scene.addEntity( body );


  helmet = new Entity();
  var helmetRenderable = new Renderable();
  helmetRenderable.material = new Material( new Shader("helmet shader", "./assets/shaders/test.vert", "./assets/shaders/test.frag") );
  helmetRenderable.mesh = new Mesh( "./assets/models/excalibur_helmet.obj" );
  helmetRenderable.material.properties["uMainTex"] = new Texture( "./assets/textures/ExcaliburHelmet_Diffuse.png" );
  helmet.addComponent( helmetRenderable );

  helmet.getComponent( "Transform" ).parent = body.getComponent( "Transform" );
  scene.addEntity(helmet);

  camera = new Entity();
  camera.addComponent( new Camera( 60, new Vec3( 100, 100, 0 ) ) );
  camera.getComponent( "Transform" ).position.z = 1;
  scene.addEntity( camera );

  //var texture = new Texture("./assets/textures/testTexture.png");

  scene.startup();
  //scene.update( 0.0 );


  var canvas = document.getElementById( "glcanvas" );
  canvas.addEventListener("mouseenter", function(e) {
    updateInterval = setInterval( function(){update(0.03)}, 30 );
  }, false);

  canvas.addEventListener("mouseleave", function(e) {
    clearInterval( updateInterval );
  }, false);

}

var time = 0;
function update ( dt ) {
  time += dt;
  body.getComponent("Transform").rotation = Quaternion.makeAngleAxis( 45 * time, new Vec3(0, 1, 0) );
  //camera.getComponent("Transform").rotation = Quaternion.makeAngleAxis( 45 * Math.sin( time * 2 ), new Vec3( 1, 0, 0 ) );
  //camera.getComponent("Transform").position.x = Math.sin( time );
  scene.update(dt);
}
