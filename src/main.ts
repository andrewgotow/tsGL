var excalibur_transform : Transform = null;
var time : number = 0;

function start () {
  Scene.loadSceneWithId( "scene1" );

  Entity.entityWithId( "excalibur_body" );

  excalibur_transform = <Transform>Entity.entityWithId( "excalibur_body" ).getComponent("Transform");
  var helmet_transform : Transform = <Transform>Entity.entityWithId( "excalibur_helmet" ).getComponent("Transform");
  helmet_transform.parent = excalibur_transform;

  setInterval( function () { update( 0.03 ) }, 30 );
}

function update ( dt: number ) {
  time += dt;
  excalibur_transform.rotation = Quaternion.makeAngleAxis( 6.283 * 5 * time, new Vec3(0,1,0) );
}
