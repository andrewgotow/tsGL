/*
var scene : Scene = null;
var body : Entity = null;
var helmet : Entity = null;
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
*/

function start () {

  Scene.loadSceneWithId( "scene1" );
  // Init the scene, and its sytems.
  //scene = new Scene();
  //scene.addSystem( new Renderer() );

  // build the body entity, starting by loading the mesh.
  //loadBody();
  //loadHelmet();
  //(<Transform>helmet.getComponent("Transform")).parent = <Transform>body.getComponent( "Transform")

  //camera = new Entity();
  //camera.addComponent( new Camera( 60, new Vec3( 100, 100, 0 ) ) );
  //(<Transform>camera.getComponent( "Transform" )).position.z = 1;
  //scene.addEntity( camera );

  //Scene.loadScene( scene );

}
