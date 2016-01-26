# tsGL
tsGL is a quick experiment in modern web technologies. Built as a platform for WebGL experimentation, it utilizes [TypeScript](http://www.typescriptlang.org/), a superset of standard Javascript to allow for better type management and a more familiar syntax for those of us who are used to C-family languages.

# Architecture
In recent years, an architectural pattern known as "Entity Component System" has become extremely popular, especially in game engines. It emphasizes object composition over typical inheritance which can be useful in systems where object hierarchies are often broad rather than deep. tsGL defines a variant of this architecture, and consists of a set of clearly defined objects.

- **Scene:**
 A scene is defined as a hierarchy of entities and a set of systems. Scenes are responsible for quickly looking up active entities, and maintaining the main run loop. A scene can be created via HTML markup, or initialized via Javascript, and then made active using the *loadScene* function.

- **Entity:**
Entities serve as a container class for a set of components, and allow for easy retrieval and modification of those components. All entities are initialized with a "Transform" component by default, which defines a position, orientation, and parent transform. 

- **Component:**
Components are plain data objects that can be attached to entities. In theory, components should not provide functionality, however this line may be blurred depending on their specific use. Components will be operated on by systems as required.

- **System:**
Systems perform the real work in the application. When an entity is added to a scene, its components are passed to each system, which will independently maintain references to each component relevant to performing the system's defined function.

# Markup
tsGL makes use of custom HTML elements, a feature of the draft Web-Components framework. These custom elements can be used to easily define object factories in a way that fits well within the existing web-app conventions. Scenes can be defined directly in the document, including references to assets, entity prefabs, and object hierarchies. Here's an example.

    <tsgl-shader id="shader" vert-src="/shaders/test.vert" frag-src="/shaders/test.frag"></tsgl-shader>
    <tsgl-mesh id="mesh_dragon" src="/models/dragon.obj"></tsgl-mesh>
    <tsgl-material id="mat_dragon" shader="shader">
      <tsgl-texture name="uMainTex" src="/textures/marble.png"></tsgl-texture>
    </tsgl-material>

    <tsgl-scene id="scene1">
        <tsgl-system type="renderer"></tsgl-system>

        <tsgl-entity>
            <tsgl-component type="camera"></tsgl-component>
            <tsgl-component type="transform" x="0" y="0" z="1"></tsgl-component>
        </tsgl-entity>

        <tsgl-entity id="dragon">
            <tsgl-component type="transform" x="0" y="0" z="0"></tsgl-component>
            <tsgl-component type="renderable" mesh="mesh_dragon" material="mat_dragon"></tsgl-component>  
        </tsgl-entity>
    </tsgl-scene>

With this inserted into the document, this scene can be loaded using the function, *Scene.loadSceneWithId( id )*, and the entire entity hierarchy will be instantiated, and displayed in the active WebGL context. Assets can be referenced in the DOM, and are loaded when they are first requested, meaning there is little to no additional overhead for defining multiple scenes in a single page.

# Going Further
tsGL is an experimental platform, and is nowhere near complete as a result. I wanted to play with WebGL, asset loading, and the TypeScript language as quickly as I could, so the project is largely incomplete, unclean, and undocumented. The examples provided simply ignore assets that have not been fully loaded, display only simple scenes, and have not been tested for robustness.

That being said, tsGL is designed to be as flexible as possible. By adding additional systems, and their associated components, nearly any desired functionality can be added. At the moment, only basic WebGL rendering is supported, but additional systems may be added in the future.

Enjoy!
