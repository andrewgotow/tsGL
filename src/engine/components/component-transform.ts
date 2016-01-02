class Transform extends Component {
  position : Vec3;
  rotation : Quaternion;
  scale : Vec3;
  parent : Transform;

  constructor () {
    super();
    this.position = Vec3.zero();
    this.rotation = Quaternion.makeIdentity();
    this.scale = Vec3.one();
    this.parent = null;
  }

  // TODO: Cache transformation matrix so that querying the child doesn't need
  // to rebuild the parent matrix.
  getMatrix () : Mat4 {
    var p = Mat4.makeIdentity();
    if ( this.parent != null )
        p = this.parent.getMatrix();

    var t = Mat4.makeTranslation( this.position );
    var r = this.rotation.getMatrix();
    var s = Mat4.makeScale( this.scale );
    return Mat4.mul( Mat4.mul( Mat4.mul( s, r ), t ), p );
  }
}
