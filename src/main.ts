var transform : Transform = null;
var time : number = 0;

function start () {
  Scene.loadSceneWithId( "scene1" );

  transform = <Transform>Entity.entityWithId( "dragon" ).getComponent("Transform");

  setInterval( function () { update( 0.03 ) }, 30 );
}

function update ( dt: number ) {
  time += dt;
  transform.rotation = Quaternion.makeAngleAxis( 6.283 * 2 * time, new Vec3(0,1,0) );
}
