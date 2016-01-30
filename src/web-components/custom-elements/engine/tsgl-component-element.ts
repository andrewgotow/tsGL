/// <reference path="../tsgl-element.ts"/>

class TSGLComponentElement extends TSGLElement {

  buildComponent () : Component {
    var typeAttr = this.attributes.getNamedItem( "type" );
    if ( typeAttr != null ) {
      switch ( typeAttr.value ) {

        case "transform":
          var transform = new Transform();

          var properties = this.getProperties();
          if ( "position" in properties )
            transform.position = properties["position"];
          if ( "x" in properties )
            transform.position.x = properties["x"];
          if ( "y" in properties )
            transform.position.y = properties["y"];
          if ( "z" in properties )
            transform.position.z = properties["z"];

          return transform;

        case "renderable":
          var renderable = new Renderable();

          var properties = this.getProperties();
          if ( "mesh" in properties )
            renderable.mesh = properties["mesh"];
          if ( "material" in properties )
            renderable.material = properties["material"];

          return renderable;

        case "light":
          var light = new Light( new Color(1,1,1,1), 1.0, 10.0 );

          var properties = this.getProperties();
          if ( "color" in properties )
            light.color = properties["color"];
          if ( "intensity" in properties )
            light.intensity = properties["intensity"];
          if ( "range" in properties )
            light.range = properties["range"];
          /*
          if ( "type" in properties )
            light.type = LightType[ <string>properties["type"] ];
          */
          return light;

        case "camera":
          var camera = new Camera( 60, 1.0 );

          var properties = this.getProperties();
          if ( "fov" in properties )
            camera.fieldOfView = properties["fov"];
          if ( "aspect" in properties )
            camera.aspect = properties["aspect"];

          return camera;

        default:
          console.error( "Attempting to instantiate unknown component from DOM Element" );
          return null;
      }
    }
  }

}
