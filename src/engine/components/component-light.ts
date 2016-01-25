enum LightType { POINT, DIRECTIONAL };

// TODO: Lighting is currently not used.

class Light extends Component {

  color : Color;
  intensity : number;
  type : LightType;
  range : number;

  constructor ( color : Color, intensity : number, range : number ) {
    super();
    this.color = color;
    this.intensity = intensity;
    this.type = LightType.POINT;
    this.range = range;
  }

  importanceForEntity ( entity : Entity ) : number {
    switch ( this.type ) {
      case LightType.DIRECTIONAL:
        return this.intensity;
      case LightType.POINT:
        // TODO: Implement attenuation calculations for light importance.
        return this.intensity;
      default:
        return 0;
    }
  }

  getMatrix () {
    var position = (<Transform>this.entity.getComponent("Transform")).position;
    return new Mat4([
      this.color.r,	  0, 0, position.x,
      this.color.g,   0, 0, position.y,
      this.color.b,   0, 0, position.z,
      this.intensity, 0, 0, this.range
    ]);
  }
}
