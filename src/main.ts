var scene : Scene = null;
var body : Entity = null;
var helmet : Entity = null;
var updateInterval : number = null;
var camera : Entity = null;

function loadBody () {
  var mesh = Mesh.fromFile( "./assets/models/excalibur_body.obj" );
  body = new Entity();
  mesh.onReady = function () {
    var renderable = new Renderable();
    renderable.material = new Material( new Shader("body shader", "./assets/shaders/test.vert", "./assets/shaders/test.frag") );
    renderable.material.properties["uMainTex"] = Texture.fromFile( "./assets/textures/ExcaliburBody_Diffuse.png" );
    renderable.mesh = mesh;
    body.addComponent( renderable );
    (<Transform>body.getComponent( "Transform" )).position.y = -1.0;
    scene.addEntity( body );
  }
}

function loadHelmet () {
  var mesh = Mesh.fromFile( "./assets/models/excalibur_helmet.obj" );
  helmet = new Entity();
  mesh.onReady = function () {
    var renderable = new Renderable();
    renderable.material = new Material( new Shader("helmet shader", "./assets/shaders/test.vert", "./assets/shaders/test.frag") );
    renderable.material.properties["uMainTex"] = Texture.fromFile( "./assets/textures/ExcaliburHelmet_Diffuse.png" );
    renderable.mesh = mesh;
    helmet.addComponent( renderable );
    scene.addEntity( helmet );
  }
}

function start () {
  // Init the scene, and its sytems.
  scene = new Scene();
  scene.addSystem( new Renderer() );

  // build the body entity, starting by loading the mesh.
  loadBody();
  loadHelmet();
  (<Transform>helmet.getComponent("Transform")).parent = <Transform>body.getComponent( "Transform")

  camera = new Entity();
  camera.addComponent( new Camera( 60, new Vec3( 100, 100, 0 ) ) );
  (<Transform>camera.getComponent( "Transform" )).position.z = 1;
  scene.addEntity( camera );

  scene.startup();

  var canvas = document.getElementById( "glcanvas" );
  canvas.addEventListener("mouseenter", function(e) {
    updateInterval = setInterval( function(){update(0.03)}, 30 );
  }, false);

  canvas.addEventListener("mouseleave", function(e) {
    clearInterval( updateInterval );
  }, false);

}

var time = 0;
function update ( deltaTime : number ) {
  time += deltaTime;
  (<Transform>body.getComponent("Transform")).rotation = Quaternion.makeAngleAxis( 45 * time, new Vec3(0, 1, 0) );
  scene.update(deltaTime);
}
