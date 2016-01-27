// Engine Elements
document.registerElement( 'tsgl-scene', {
  prototype: Object.create( TSGLSceneElement.prototype, {} )
});

document.registerElement( 'tsgl-system', {
  prototype: Object.create( TSGLSystemElement.prototype, {} )
});

document.registerElement( 'tsgl-entity', {
  prototype: Object.create( TSGLEntityElement.prototype, {} )
});

document.registerElement( 'tsgl-component', {
  prototype: Object.create( TSGLComponentElement.prototype, {} )
});


// Asset Elements
document.registerElement( 'tsgl-shader', {
  prototype: Object.create( TSGLShaderElement.prototype, {} )
});

document.registerElement( 'tsgl-material', {
  prototype: Object.create( TSGLMaterialElement.prototype, {} )
});

document.registerElement( 'tsgl-property', {
  prototype: Object.create( TSGLPropertyElement.prototype, {} )
});


document.registerElement( 'tsgl-mesh', {
  prototype: Object.create( TSGLMeshElement.prototype, {} )
});

document.registerElement( 'tsgl-texture', {
  prototype: Object.create( TSGLTextureElement.prototype, {} )
});
