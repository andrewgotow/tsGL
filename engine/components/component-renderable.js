Renderable.prototype = new Component();
Renderable.prototype.constructor = Renderable;
function Renderable () {
  this.material = null;
  this.mesh = null;
}
