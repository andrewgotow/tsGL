var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _uniqueIdIndex = 0;
function uid() {
    return _uniqueIdIndex++;
}
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                return 'array';
            }
            return value.constructor.name;
        }
        else {
            return 'null';
        }
    }
    return s;
}
function loadFile(url, data, callback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                callback(request.responseText, data);
            }
            else {
                errorCallback(url);
            }
        }
    };
    request.send(null);
}
function loadFiles(urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;
        if (numComplete == numUrls) {
            callback(result);
        }
    }
    for (var i = 0; i < numUrls; i++) {
        loadFile(urls[i], i, partialCallback, errorCallback);
    }
}
var Asset = (function () {
    function Asset() {
        this.ready = false;
        this.onReady = function (asset) { };
    }
    return Asset;
}());
var Texture = (function (_super) {
    __extends(Texture, _super);
    function Texture() {
        _super.call(this);
        this.textureId = null;
    }
    Texture.fromFile = function (url) {
        var tex = new Texture();
        tex.textureId = GL.context.createTexture();
        var img = new Image();
        img.onload = function () {
            GL.context.bindTexture(GL.context.TEXTURE_2D, tex.textureId);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_MAG_FILTER, GL.context.LINEAR);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_MIN_FILTER, GL.context.LINEAR_MIPMAP_NEAREST);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_S, GL.context.REPEAT);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_T, GL.context.REPEAT);
            GL.context.texImage2D(GL.context.TEXTURE_2D, 0, GL.context.RGBA, GL.context.RGBA, GL.context.UNSIGNED_BYTE, img);
            GL.context.generateMipmap(GL.context.TEXTURE_2D);
            GL.context.bindTexture(GL.context.TEXTURE_2D, null);
            tex.ready = true;
            tex.onReady(tex);
        };
        img.src = url;
        return tex;
    };
    Texture.prototype._unload = function () {
        GL.context.deleteTexture(this.textureId);
    };
    return Texture;
}(Asset));
var Cubemap = (function (_super) {
    __extends(Cubemap, _super);
    function Cubemap() {
        _super.apply(this, arguments);
    }
    Cubemap.fromFiles = function (urls) {
        var tex = new Cubemap();
        tex.textureId = GL.context.createTexture();
        GL.context.bindTexture(GL.context.TEXTURE_CUBE_MAP, tex.textureId);
        GL.context.texParameteri(GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_MAG_FILTER, GL.context.LINEAR);
        GL.context.texParameteri(GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_MIN_FILTER, GL.context.LINEAR);
        GL.context.texParameteri(GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_WRAP_S, GL.context.CLAMP_TO_EDGE);
        GL.context.texParameteri(GL.context.TEXTURE_CUBE_MAP, GL.context.TEXTURE_WRAP_T, GL.context.CLAMP_TO_EDGE);
        var numLoaded = 0;
        for (var i = 0; i < 6; i++) {
            var img = new Image();
            var face = Cubemap._targetForFace(i);
            (function (face) {
                img.onload = function () {
                    GL.context.bindTexture(GL.context.TEXTURE_CUBE_MAP, tex.textureId);
                    GL.context.texImage2D(face, 0, GL.context.RGBA, GL.context.RGBA, GL.context.UNSIGNED_BYTE, img);
                    if (++numLoaded == 6) {
                        tex.ready = true;
                        tex.onReady(tex);
                    }
                };
            })(face);
            img.src = urls[i];
        }
        return tex;
    };
    Cubemap._targetForFace = function (index) {
        switch (index) {
            case 0: return GL.context.TEXTURE_CUBE_MAP_POSITIVE_X;
            case 1: return GL.context.TEXTURE_CUBE_MAP_NEGATIVE_X;
            case 2: return GL.context.TEXTURE_CUBE_MAP_POSITIVE_Y;
            case 3: return GL.context.TEXTURE_CUBE_MAP_NEGATIVE_Y;
            case 4: return GL.context.TEXTURE_CUBE_MAP_POSITIVE_Z;
            default: return GL.context.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        }
    };
    return Cubemap;
}(Texture));
var Material = (function (_super) {
    __extends(Material, _super);
    function Material(shader) {
        _super.call(this);
        this.shader = shader;
        this.properties = {};
        this.ready = true;
        this.onReady(this);
    }
    Material.prototype.useMaterial = function () {
        if (this.shader != null) {
            this.shader.useProgram();
            for (var key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    this.shader.setUniform(key, this.properties[key]);
                }
            }
        }
    };
    return Material;
}(Asset));
var Mesh = (function (_super) {
    __extends(Mesh, _super);
    function Mesh() {
        _super.call(this);
        this._vbo = null;
        this._ebo = null;
    }
    Mesh.fromFile = function (url) {
        var mesh = new Mesh();
        loadFile(url, url, function (text, url) {
            var tmp_positions = new Array();
            var tmp_normals = new Array();
            var tmp_texcoords = new Array();
            var match;
            var vertRe = /v (-?[\d\.]+) (-?[\d\.]+) (-?[\d\.]+)/g;
            do {
                match = vertRe.exec(text);
                if (match)
                    tmp_positions.push(Number(match[1]), Number(match[2]), Number(match[3]));
            } while (match);
            var normRe = /vn (-?[\d\.]+) (-?[\d\.]+) (-?[\d\.]+)/g;
            do {
                match = normRe.exec(text);
                if (match)
                    tmp_normals.push(Number(match[1]), Number(match[2]), Number(match[3]));
            } while (match);
            var texRe = /vt (-?[\d\.]+) (-?[\d\.]+)/g;
            do {
                match = texRe.exec(text);
                if (match)
                    tmp_texcoords.push(Number(match[1]), 1.0 - Number(match[2]));
            } while (match);
            var assembledPositions = new Array();
            var assembledNormals = new Array();
            var assembledTexcoords = new Array();
            var assembledElements = new Array();
            var vertexIndexMap = {};
            var uniqueVertexCount = 0;
            var triRe = /f (\d+)\/(\d+)\/(\d+) (\d+)\/(\d+)\/(\d+) (\d+)\/(\d+)\/(\d+)/g;
            do {
                match = triRe.exec(text);
                if (match) {
                    for (var vert = 0; vert < 3; vert++) {
                        var vi = Number(match[vert * 3 + 1]) - 1;
                        var ti = Number(match[vert * 3 + 2]) - 1;
                        var ni = Number(match[vert * 3 + 3]) - 1;
                        var key = vi + "-" + ni + "-" + ti;
                        if (!(key in vertexIndexMap)) {
                            assembledPositions.push(tmp_positions[vi * 3 + 0], tmp_positions[vi * 3 + 1], tmp_positions[vi * 3 + 2]);
                            assembledNormals.push(tmp_normals[ni * 3 + 0], tmp_normals[ni * 3 + 1], tmp_normals[ni * 3 + 2]);
                            assembledTexcoords.push(tmp_texcoords[ti * 2 + 0], tmp_texcoords[ti * 2 + 1]);
                            vertexIndexMap[key] = uniqueVertexCount++;
                        }
                        assembledElements.push(vertexIndexMap[key]);
                    }
                }
            } while (match);
            mesh.positions = new Float32Array(assembledPositions);
            mesh.normals = new Float32Array(assembledNormals);
            mesh.texcoords = new Float32Array(assembledTexcoords);
            mesh.triangles = new Int16Array(assembledElements);
            mesh._buildVbo();
            mesh._buildEbo();
            mesh.ready = true;
            mesh.onReady(mesh);
        }, function (url) {
            console.error("Could not download Mesh file, \"" + url + "\"");
        });
        return mesh;
    };
    Mesh.prototype._buildVbo = function () {
        if (this._vbo == null)
            this._vbo = GL.context.createBuffer();
        GL.context.bindBuffer(GL.context.ARRAY_BUFFER, this._vbo);
        GL.context.bufferData(GL.context.ARRAY_BUFFER, 4 * (this.positions.length + this.normals.length + this.texcoords.length), GL.context.STATIC_DRAW);
        GL.context.bufferSubData(GL.context.ARRAY_BUFFER, 0, this.positions);
        GL.context.bufferSubData(GL.context.ARRAY_BUFFER, 4 * this.positions.length, this.normals);
        GL.context.bufferSubData(GL.context.ARRAY_BUFFER, 4 * (this.positions.length + this.normals.length), this.texcoords);
    };
    Mesh.prototype._buildEbo = function () {
        if (this._ebo == null)
            this._ebo = GL.context.createBuffer();
        GL.context.bindBuffer(GL.context.ELEMENT_ARRAY_BUFFER, this._ebo);
        GL.context.bufferData(GL.context.ELEMENT_ARRAY_BUFFER, this.triangles, GL.context.STATIC_DRAW);
    };
    Mesh.prototype._destroyBuffers = function () {
        GL.context.deleteBuffer(this._vbo);
        GL.context.deleteBuffer(this._ebo);
    };
    Mesh.prototype.getVbo = function () {
        if (this._vbo == null)
            console.warn("Attempting to access VBO of Mesh asset before it has been created.");
        return this._vbo;
    };
    Mesh.prototype.getEbo = function () {
        if (this._ebo == null)
            console.warn("Attempting to access EBO of Mesh asset before it has been created.");
        return this._ebo;
    };
    return Mesh;
}(Asset));
var Shader = (function (_super) {
    __extends(Shader, _super);
    function Shader(name, vertUrl, fragUrl) {
        _super.call(this);
        this._program = null;
        this.name = name;
        this.vertUrl = vertUrl;
        this.fragUrl = fragUrl;
        this.attributes = {};
        this.uniforms = {};
        this._texUnitMap = {};
        this._program = null;
        this._buildShader();
    }
    Shader.prototype._buildShader = function () {
        var shader = this;
        loadFiles([shader.vertUrl, shader.fragUrl], function (shaderText) {
            var vert = GL.context.createShader(GL.context.VERTEX_SHADER);
            GL.context.shaderSource(vert, shaderText[0]);
            GL.context.compileShader(vert);
            if (!GL.context.getShaderParameter(vert, GL.context.COMPILE_STATUS)) {
                console.error("GLSL error in \"" + shader.vertUrl + "\": " + GL.context.getShaderInfoLog(vert));
                GL.context.deleteProgram(vert);
            }
            var frag = GL.context.createShader(GL.context.FRAGMENT_SHADER);
            GL.context.shaderSource(frag, shaderText[1]);
            GL.context.compileShader(frag);
            if (!GL.context.getShaderParameter(frag, GL.context.COMPILE_STATUS)) {
                console.error("GLSL error in \"" + shader.fragUrl + "\": " + GL.context.getShaderInfoLog(frag));
                GL.context.deleteProgram(frag);
            }
            var program = GL.context.createProgram();
            GL.context.attachShader(program, vert);
            GL.context.attachShader(program, frag);
            GL.context.linkProgram(program);
            if (!GL.context.getProgramParameter(program, GL.context.LINK_STATUS)) {
                console.error("GLSL link error in \"" + shader.name + "\": " + GL.context.getProgramInfoLog(program));
                GL.context.deleteProgram(program);
            }
            shader._program = program;
            shader._getUniforms();
            shader._getAttributes();
            shader.ready = true;
            shader.onReady(shader);
        }, function (url) {
            alert('Failed to download shader program "' + url + '"');
        });
    };
    Shader.prototype.useProgram = function () {
        GL.context.useProgram(this._program);
        GL.context.enableVertexAttribArray(this.attributes["vPosition"]);
        GL.context.enableVertexAttribArray(this.attributes["vNormal"]);
        GL.context.enableVertexAttribArray(this.attributes["vTexcoord"]);
    };
    Shader.prototype._getUniforms = function () {
        var count = GL.context.getProgramParameter(this._program, GL.context.ACTIVE_UNIFORMS);
        for (var i = 0; i < count; i++) {
            var name = GL.context.getActiveUniform(this._program, i).name;
            this.uniforms[name] = GL.context.getUniformLocation(this._program, name);
        }
    };
    Shader.prototype._getAttributes = function () {
        var count = GL.context.getProgramParameter(this._program, GL.context.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < count; i++) {
            var name = GL.context.getActiveAttrib(this._program, i).name;
            this.attributes[name] = GL.context.getAttribLocation(this._program, name);
        }
    };
    Shader.prototype._texUnitForName = function (name) {
        if (!(name in this._texUnitMap)) {
            this._texUnitMap[name] = 0;
            for (var key in this._texUnitMap) {
                if (key != name)
                    this._texUnitMap[name]++;
            }
        }
        return this._texUnitMap[name];
    };
    Shader.prototype.setUniform = function (key, value) {
        if (this._program == null)
            return;
        GL.context.useProgram(this._program);
        if (key in this.uniforms) {
            var loc = this.uniforms[key];
            switch (typeOf(value)) {
                case "number":
                    GL.context.uniform1f(loc, value);
                    break;
                case "array":
                    GL.context.uniform1fv(loc, new Float32Array(value));
                    break;
                case "Vec3":
                    GL.context.uniform3f(loc, value.x, value.y, value.z);
                    break;
                case "Mat4":
                    GL.context.uniformMatrix4fv(loc, false, value.data);
                    break;
                case "Texture":
                    if (value.ready) {
                        var texUnit = this._texUnitForName(key);
                        GL.context.uniform1i(loc, texUnit);
                        GL.context.activeTexture(GL.context.TEXTURE0 + texUnit);
                        GL.context.bindTexture(GL.context.TEXTURE_2D, value.textureId);
                    }
                    break;
                case "Cubemap":
                    if (value.ready) {
                        var texUnit = this._texUnitForName(key);
                        GL.context.uniform1i(loc, texUnit);
                        GL.context.activeTexture(GL.context.TEXTURE0 + texUnit);
                        GL.context.bindTexture(GL.context.TEXTURE_CUBE_MAP, value.textureId);
                    }
                    break;
                default:
                    console.warn("Attempting to assign unknown type to shader uniform \"" + key + "\", in shader \"" + this.name + "\".");
            }
        }
        else {
            console.warn("Attempting to assign unknown uniform of shader \"" + key + "\", in shader \"" + this.name + "\".");
        }
    };
    return Shader;
}(Asset));
var Component = (function () {
    function Component() {
    }
    return Component;
}());
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(fov, aspect) {
        _super.call(this);
        this.fieldOfView = fov;
        this.aspect = aspect;
        this.near = 0.1;
        this.far = 100;
        this._projection = null;
    }
    Object.defineProperty(Camera.prototype, "fieldOfView", {
        get: function () {
            return this._fieldOfView;
        },
        set: function (value) {
            this._fieldOfView = value;
            this._projection = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "aspect", {
        get: function () {
            return this._aspect;
        },
        set: function (value) {
            this._aspect = value;
            this._projection = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "near", {
        get: function () {
            return this._near;
        },
        set: function (value) {
            this._near = value;
            this._projection = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "far", {
        get: function () {
            return this._far;
        },
        set: function (value) {
            this._far = value;
            this._projection = null;
        },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.getProjection = function () {
        if (this._projection == null)
            this._projection = Mat4.makePerspective(this.fieldOfView, this.aspect, this.near, this.far);
        return this._projection;
    };
    return Camera;
}(Component));
var LightType;
(function (LightType) {
    LightType[LightType["POINT"] = 0] = "POINT";
    LightType[LightType["DIRECTIONAL"] = 1] = "DIRECTIONAL";
})(LightType || (LightType = {}));
;
var Light = (function (_super) {
    __extends(Light, _super);
    function Light(color, intensity, range) {
        _super.call(this);
        this.color = color;
        this.intensity = intensity;
        this.type = LightType.POINT;
        this.range = range;
    }
    Light.prototype.importanceForEntity = function (entity) {
        switch (this.type) {
            case LightType.DIRECTIONAL:
                return this.intensity;
            case LightType.POINT:
                return this.intensity;
            default:
                return 0;
        }
    };
    Light.prototype.getMatrix = function () {
        var position = this.entity.getComponent("Transform").position;
        return new Mat4([
            this.color.r, 0, 0, position.x,
            this.color.g, 0, 0, position.y,
            this.color.b, 0, 0, position.z,
            this.intensity, 0, 0, this.range
        ]);
    };
    return Light;
}(Component));
var Renderable = (function (_super) {
    __extends(Renderable, _super);
    function Renderable() {
        _super.call(this);
        this.material = null;
        this.mesh = null;
    }
    return Renderable;
}(Component));
var Transform = (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        _super.call(this);
        this.position = Vec3.zero();
        this.rotation = Quaternion.makeIdentity();
        this.scale = Vec3.one();
        this.parent = null;
    }
    Transform.prototype.getMatrix = function () {
        var p = Mat4.makeIdentity();
        if (this.parent != null)
            p = this.parent.getMatrix();
        var t = Mat4.makeTranslation(this.position);
        var r = this.rotation.getMatrix();
        var s = Mat4.makeScale(this.scale);
        return Mat4.mul(Mat4.mul(Mat4.mul(s, r), t), p);
    };
    return Transform;
}(Component));
var Entity = (function () {
    function Entity() {
        this.id = uid();
        this.components = {};
        this.addComponent(new Transform());
    }
    Entity.prototype.getComponent = function (type) {
        if (this.components.hasOwnProperty(type))
            return this.components[type];
        return null;
    };
    Entity.prototype.addComponent = function (component) {
        component.entity = this;
        this.components[typeOf(component)] = component;
        return this;
    };
    Entity.prototype.removeComponent = function (component) {
        component.entity = null;
        delete this.components[typeOf(component)];
        return this;
    };
    Entity.entityWithId = function (id) {
        var element = document.getElementById(id);
        if (element instanceof TSGLEntityElement) {
            return element.entity;
        }
    };
    return Entity;
}());
var Scene = (function () {
    function Scene() {
        this.entities = {};
        this.systems = [];
    }
    Scene.prototype.addEntity = function (entity) {
        this.entities[entity.id] = entity;
        this.systems.forEach(function (system, index, array) {
            system.registerComponentsOfEntity(entity);
        });
        return this;
    };
    Scene.prototype.removeEntity = function (entity) {
        delete this.entities[entity.id];
        return this;
    };
    Scene.prototype.addSystem = function (system) {
        this.systems.push(system);
        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id)) {
                system.registerComponentsOfEntity(this.entities[id]);
            }
        }
        return this;
    };
    Scene.prototype.startup = function () {
        this.systems.forEach(function (system, index, array) {
            system.startup();
        });
        var scene = this;
        this._updateInterval = setInterval(function () { scene.update(0.03); }, 30);
        return this;
    };
    Scene.prototype.update = function (deltaTime) {
        this.systems.forEach(function (system, index, array) {
            system.update(deltaTime);
        });
        return this;
    };
    Scene.prototype.shutdown = function () {
        clearInterval(this._updateInterval);
        this.systems.forEach(function (system, index, array) {
            system.shutdown();
        });
        return this;
    };
    Scene.loadScene = function (scene) {
        if (Scene._currentScene != null) {
            Scene._currentScene.shutdown();
        }
        Scene._currentScene = scene;
        Scene._currentScene.startup();
    };
    Scene.loadSceneWithId = function (id) {
        var element = document.getElementById(id);
        if (element instanceof TSGLSceneElement) {
            Scene.loadScene(element.buildScene());
        }
    };
    return Scene;
}());
var System = (function () {
    function System() {
    }
    System.prototype.tryRegisterComponent = function (component) {
        return false;
    };
    System.prototype.registerComponentsOfEntity = function (entity) {
        for (var key in entity.components) {
            if (entity.components.hasOwnProperty(key)) {
                this.tryRegisterComponent(entity.components[key]);
            }
        }
    };
    System.prototype.startup = function () { };
    System.prototype.update = function (deltaTime) { };
    System.prototype.shutdown = function () { };
    return System;
}());
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        _super.call(this);
        this._renderables = [];
        this._cameras = [];
        this._lights = [];
    }
    Renderer.prototype.tryRegisterComponent = function (component) {
        if (component instanceof Camera) {
            this._cameras.push(component);
            return true;
        }
        else if (component instanceof Renderable) {
            this._renderables.push(component);
            return true;
        }
        else if (component instanceof Light) {
            this._lights.push(component);
            return true;
        }
        return false;
    };
    Renderer.prototype.update = function (deltaTime) {
        for (var camIndex = 0; camIndex < this._cameras.length; camIndex++) {
            var camera = this._cameras[camIndex];
            var viewMat = Mat4.invert(camera.entity.getComponent("Transform").getMatrix());
            var projectionMat = camera.getProjection();
            GL.context.clearColor(0.1, 0.1, 0.1, 0.0);
            GL.context.clear(GL.context.COLOR_BUFFER_BIT | GL.context.DEPTH_BUFFER_BIT);
            for (var rendIndex = 0; rendIndex < this._renderables.length; rendIndex++) {
                this._drawRenderable(this._renderables[rendIndex], viewMat, projectionMat);
            }
        }
        GL.context.flush();
    };
    Renderer.prototype._drawRenderable = function (renderable, viewMat, projectionMat) {
        var mesh = renderable.mesh;
        var material = renderable.material;
        if (!mesh.ready || !material.ready) {
            console.warn("Renderable is not ready for display, but you are drawing it anyway.");
            return;
        }
        var modelMat = renderable.entity.getComponent("Transform").getMatrix();
        var modelViewMat = Mat4.mul(modelMat, viewMat);
        material.properties["uModelViewMatrix"] = modelViewMat;
        material.properties["uProjection"] = projectionMat;
        material.properties["uNormalMatrix"] = Mat4.transpose(Mat4.invert(modelViewMat));
        material.properties["uLightMatrix"] = Mat4.makeZero();
        renderable.material.useMaterial();
        GL.context.bindBuffer(GL.context.ARRAY_BUFFER, mesh.getVbo());
        GL.context.vertexAttribPointer(material.shader.attributes["vPosition"], 3, GL.context.FLOAT, false, 0, 0);
        GL.context.vertexAttribPointer(material.shader.attributes["vNormal"], 3, GL.context.FLOAT, true, 0, 4 * (mesh.positions.length));
        GL.context.vertexAttribPointer(material.shader.attributes["vTexcoord"], 2, GL.context.FLOAT, false, 0, 4 * (mesh.positions.length + mesh.normals.length));
        GL.context.bindBuffer(GL.context.ELEMENT_ARRAY_BUFFER, mesh.getEbo());
        GL.context.blendFunc(GL.context.SRC_ALPHA, GL.context.ONE_MINUS_SRC_ALPHA);
        GL.context.drawElements(GL.context.TRIANGLES, mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0);
        GL.context.blendFunc(GL.context.SRC_ALPHA, GL.context.ONE);
        var lights = this._lights.sort(function (a, b) {
            return a.importanceForEntity(renderable.entity) - b.importanceForEntity(renderable.entity);
        });
        for (var i = 0; i < Math.min(lights.length, 4); i++) {
            material.shader.setUniform("uLightMatrix", lights[i].getMatrix());
            GL.context.drawElements(GL.context.TRIANGLES, mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0);
        }
    };
    return Renderer;
}(System));
var GL = (function () {
    function GL() {
    }
    GL.init = function (canvas) {
        try {
            GL.context = canvas.getContext("webgl");
            GL.context.enable(GL.context.BLEND);
            GL.context.enable(GL.context.DEPTH_TEST);
            GL.context.depthFunc(GL.context.LEQUAL);
            GL.context.viewport(0, 0, canvas.width, canvas.height);
        }
        catch (e) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
    };
    return GL;
}());
var transform = null;
var time = 0;
function start() {
    transform = Entity.entityWithId("camera").getComponent("Transform");
    setInterval(function () { update(0.03); }, 30);
}
function update(dt) {
    time += dt;
    transform.rotation = Quaternion.makeAngleAxis(6.283 * 2 * time, new Vec3(0, 1, 0));
}
var Color = (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Color.fromHex = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r = parseInt(result[1], 16) / 255.0;
        var g = parseInt(result[2], 16) / 255.0;
        var b = parseInt(result[3], 16) / 255.0;
        return new Color(r, g, b, 1.0);
    };
    Color.add = function (a, b) {
        return new Color(a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a);
    };
    Color.sub = function (a, b) {
        return new Color(a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a);
    };
    Color.multiply = function (a, b) {
        return new Color(a.r * b.r, a.g * b.g, a.b * b.b, a.a * b.a);
    };
    return Color;
}());
var Mat4 = (function () {
    function Mat4(data) {
        this.data = new Float32Array(data);
    }
    Mat4.prototype.get = function (col, row) {
        return this.data[4 * row + col];
    };
    Mat4.prototype.set = function (col, row, value) {
        this.data[4 * row + col] = value;
        return this;
    };
    Mat4.makeZero = function () {
        return new Mat4([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]);
    };
    Mat4.makeIdentity = function () {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    };
    Mat4.makeTranslation = function (vec) {
        var c = Mat4.makeIdentity();
        c.set(0, 3, vec.x);
        c.set(1, 3, vec.y);
        c.set(2, 3, vec.z);
        return c;
    };
    Mat4.makeScale = function (vec) {
        var c = Mat4.makeIdentity();
        c.set(0, 0, vec.x);
        c.set(1, 1, vec.y);
        c.set(2, 2, vec.z);
        return c;
    };
    Mat4.makePerspective = function (fov, aspect, zNear, zFar) {
        var fovRad = fov * 0.0174533;
        var top = Math.tan(fovRad / 2) * zNear;
        var right = top * aspect;
        var mat = Mat4.makeIdentity();
        mat.set(0, 0, zNear / right);
        mat.set(1, 1, zNear / top);
        mat.set(2, 2, -(zFar + zNear) / (zFar - zNear));
        mat.set(2, 3, -2.0 * zFar * zNear / (zFar - zNear));
        mat.set(3, 2, -1);
        return mat;
    };
    Mat4.mul = function (m1, m2) {
        var m = Mat4.makeZero();
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 4; ++j) {
                for (var k = 0; k < 4; ++k) {
                    m.data[4 * i + j] += m1.data[4 * i + k] * m2.data[4 * k + j];
                }
            }
        }
        return m;
    };
    Mat4.scale = function (mat, s) {
        var newMat = Mat4.makeIdentity();
        newMat.data = mat.data.map(function (n) { return n * s; });
        return newMat;
    };
    Mat4.invert = function (mat) {
        var m = mat.data;
        var inv = Array(16);
        inv[0] = m[5] * m[10] * m[15] -
            m[5] * m[11] * m[14] -
            m[9] * m[6] * m[15] +
            m[9] * m[7] * m[14] +
            m[13] * m[6] * m[11] -
            m[13] * m[7] * m[10];
        inv[4] = -m[4] * m[10] * m[15] +
            m[4] * m[11] * m[14] +
            m[8] * m[6] * m[15] -
            m[8] * m[7] * m[14] -
            m[12] * m[6] * m[11] +
            m[12] * m[7] * m[10];
        inv[8] = m[4] * m[9] * m[15] -
            m[4] * m[11] * m[13] -
            m[8] * m[5] * m[15] +
            m[8] * m[7] * m[13] +
            m[12] * m[5] * m[11] -
            m[12] * m[7] * m[9];
        inv[12] = -m[4] * m[9] * m[14] +
            m[4] * m[10] * m[13] +
            m[8] * m[5] * m[14] -
            m[8] * m[6] * m[13] -
            m[12] * m[5] * m[10] +
            m[12] * m[6] * m[9];
        inv[1] = -m[1] * m[10] * m[15] +
            m[1] * m[11] * m[14] +
            m[9] * m[2] * m[15] -
            m[9] * m[3] * m[14] -
            m[13] * m[2] * m[11] +
            m[13] * m[3] * m[10];
        inv[5] = m[0] * m[10] * m[15] -
            m[0] * m[11] * m[14] -
            m[8] * m[2] * m[15] +
            m[8] * m[3] * m[14] +
            m[12] * m[2] * m[11] -
            m[12] * m[3] * m[10];
        inv[9] = -m[0] * m[9] * m[15] +
            m[0] * m[11] * m[13] +
            m[8] * m[1] * m[15] -
            m[8] * m[3] * m[13] -
            m[12] * m[1] * m[11] +
            m[12] * m[3] * m[9];
        inv[13] = m[0] * m[9] * m[14] -
            m[0] * m[10] * m[13] -
            m[8] * m[1] * m[14] +
            m[8] * m[2] * m[13] +
            m[12] * m[1] * m[10] -
            m[12] * m[2] * m[9];
        inv[2] = m[1] * m[6] * m[15] -
            m[1] * m[7] * m[14] -
            m[5] * m[2] * m[15] +
            m[5] * m[3] * m[14] +
            m[13] * m[2] * m[7] -
            m[13] * m[3] * m[6];
        inv[6] = -m[0] * m[6] * m[15] +
            m[0] * m[7] * m[14] +
            m[4] * m[2] * m[15] -
            m[4] * m[3] * m[14] -
            m[12] * m[2] * m[7] +
            m[12] * m[3] * m[6];
        inv[10] = m[0] * m[5] * m[15] -
            m[0] * m[7] * m[13] -
            m[4] * m[1] * m[15] +
            m[4] * m[3] * m[13] +
            m[12] * m[1] * m[7] -
            m[12] * m[3] * m[5];
        inv[14] = -m[0] * m[5] * m[14] +
            m[0] * m[6] * m[13] +
            m[4] * m[1] * m[14] -
            m[4] * m[2] * m[13] -
            m[12] * m[1] * m[6] +
            m[12] * m[2] * m[5];
        inv[3] = -m[1] * m[6] * m[11] +
            m[1] * m[7] * m[10] +
            m[5] * m[2] * m[11] -
            m[5] * m[3] * m[10] -
            m[9] * m[2] * m[7] +
            m[9] * m[3] * m[6];
        inv[7] = m[0] * m[6] * m[11] -
            m[0] * m[7] * m[10] -
            m[4] * m[2] * m[11] +
            m[4] * m[3] * m[10] +
            m[8] * m[2] * m[7] -
            m[8] * m[3] * m[6];
        inv[11] = -m[0] * m[5] * m[11] +
            m[0] * m[7] * m[9] +
            m[4] * m[1] * m[11] -
            m[4] * m[3] * m[9] -
            m[8] * m[1] * m[7] +
            m[8] * m[3] * m[5];
        inv[15] = m[0] * m[5] * m[10] -
            m[0] * m[6] * m[9] -
            m[4] * m[1] * m[10] +
            m[4] * m[2] * m[9] +
            m[8] * m[1] * m[6] -
            m[8] * m[2] * m[5];
        var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
        if (det == 0)
            return null;
        det = 1.0 / det;
        for (var i = 0; i < 16; i++)
            inv[i] *= det;
        var newMat = Mat4.makeZero();
        newMat.data = inv;
        return newMat;
    };
    Mat4.transpose = function (m) {
        return new Mat4([
            m.get(0, 0), m.get(0, 1), m.get(0, 2), m.get(0, 3),
            m.get(1, 0), m.get(1, 1), m.get(1, 2), m.get(1, 3),
            m.get(2, 0), m.get(2, 1), m.get(2, 2), m.get(2, 3),
            m.get(3, 0), m.get(3, 1), m.get(3, 2), m.get(3, 3)
        ]);
    };
    return Mat4;
}());
var Quaternion = (function () {
    function Quaternion(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Quaternion.prototype.normalized = function () {
        var invMag = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        return new Quaternion(this.x * invMag, this.y * invMag, this.z * invMag, this.w * invMag);
    };
    Quaternion.prototype.getMatrix = function () {
        var q = this.normalized();
        var x2 = q.x + q.x;
        var y2 = q.y + q.y;
        var z2 = q.z + q.z;
        var yy2 = q.y * y2;
        var xy2 = q.x * y2;
        var xz2 = q.x * z2;
        var yz2 = q.y * z2;
        var zz2 = q.z * z2;
        var wz2 = q.w * z2;
        var wy2 = q.w * y2;
        var wx2 = q.w * x2;
        var xx2 = q.x * x2;
        return new Mat4([
            -yy2 - zz2 + 1, xy2 + wz2, xz2 - wy2, 0,
            xy2 - wz2, -xx2 - zz2 + 1, yz2 + wx2, 0,
            xz2 + wy2, yz2 - wx2, -xx2 - yy2 + 1, 0,
            0, 0, 0, 1
        ]);
    };
    Quaternion.makeIdentity = function () {
        return new Quaternion(0, 0, 0, 1);
    };
    Quaternion.makeAngleAxis = function (angle, axis) {
        var radAngle = angle * (3.141 / 180.0) * 0.5;
        var sinAngle = Math.sin(radAngle);
        var cosAngle = Math.cos(radAngle);
        var nAxis = axis.normalized();
        return new Quaternion(nAxis.x * sinAngle, nAxis.y * sinAngle, nAxis.z * sinAngle, cosAngle);
    };
    Quaternion.mul = function (q1, q2) {
        return new Quaternion(q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y, q1.w * q2.y + q1.y * q2.w + q1.z * q2.x - q1.x * q2.z, q1.w * q2.z + q1.z * q2.w + q1.x * q2.y - q1.y * q2.x, q1.w * q2.w - q1.x * q2.z - q1.y * q2.y - q1.z * q2.z);
    };
    return Quaternion;
}());
var Vec3 = (function () {
    function Vec3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vec3.prototype.inverse = function () {
        return new Vec3(-this.x, -this.y, -this.z);
    };
    Vec3.prototype.sqrMagnitude = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    Vec3.prototype.magnitude = function () {
        return Math.sqrt(this.sqrMagnitude());
    };
    Vec3.prototype.normalized = function () {
        return Vec3.scale(this, 1 / this.magnitude());
    };
    Vec3.one = function () {
        return new Vec3(1, 1, 1);
    };
    Vec3.zero = function () {
        return new Vec3(0, 0, 0);
    };
    Vec3.add = function (v1, v2) {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    };
    Vec3.sub = function (v1, v2) {
        return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    };
    Vec3.scale = function (v, s) {
        return new Vec3(v.x * s, v.y * s, v.z * s);
    };
    Vec3.dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    };
    Vec3.cross = function (v1, v2) {
        return new Vec3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    };
    return Vec3;
}());
var TSGLCubemapElement = (function (_super) {
    __extends(TSGLCubemapElement, _super);
    function TSGLCubemapElement() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TSGLCubemapElement.prototype, "cubemap", {
        get: function () {
            if (this._cubemap == null)
                this.loadAsset();
            return this._cubemap;
        },
        enumerable: true,
        configurable: true
    });
    TSGLCubemapElement.prototype.loadAsset = function () {
        var leftSrcAttr = this.attributes.getNamedItem("left-src");
        var rightSrcAttr = this.attributes.getNamedItem("right-src");
        var topSrcAttr = this.attributes.getNamedItem("top-src");
        var bottomSrcAttr = this.attributes.getNamedItem("bottom-src");
        var frontSrcAttr = this.attributes.getNamedItem("front-src");
        var backSrcAttr = this.attributes.getNamedItem("back-src");
        var urls = [];
        if (leftSrcAttr != null &&
            rightSrcAttr != null &&
            topSrcAttr != null &&
            bottomSrcAttr != null &&
            frontSrcAttr != null &&
            backSrcAttr != null) {
            var urls = [leftSrcAttr.value, rightSrcAttr.value, topSrcAttr.value, bottomSrcAttr.value, frontSrcAttr.value, backSrcAttr.value];
            this._cubemap = Cubemap.fromFiles(urls);
        }
    };
    return TSGLCubemapElement;
}(HTMLElement));
var TSGLElement = (function (_super) {
    __extends(TSGLElement, _super);
    function TSGLElement() {
        _super.apply(this, arguments);
    }
    TSGLElement.prototype.getProperties = function () {
        var properties = {};
        var elements = this.getElementsByTagName("tsgl-property");
        for (var i = 0; i < elements.length; i++) {
            var property = elements[i];
            properties[property.key] = property.getValue();
        }
        return properties;
    };
    TSGLElement.buildEntityHierarchy = function (element, parentTransform) {
        if (parentTransform === void 0) { parentTransform = null; }
        var returnEntities = [];
        var transform = null;
        if (element instanceof TSGLEntityElement) {
            var entity = element.buildEntity();
            transform = entity.getComponent("Transform");
            transform.parent = parentTransform;
            returnEntities.push(entity);
        }
        var children = element.childNodes;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child instanceof HTMLElement) {
                var childEntities = TSGLElement.buildEntityHierarchy(child, transform);
                returnEntities = returnEntities.concat(childEntities);
            }
        }
        return returnEntities;
    };
    return TSGLElement;
}(HTMLElement));
var TSGLMaterialElement = (function (_super) {
    __extends(TSGLMaterialElement, _super);
    function TSGLMaterialElement() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TSGLMaterialElement.prototype, "material", {
        get: function () {
            if (this._material == null)
                this.loadAsset();
            return this._material;
        },
        enumerable: true,
        configurable: true
    });
    TSGLMaterialElement.prototype.loadAsset = function () {
        var shaderAttr = this.attributes.getNamedItem("shader");
        if (shaderAttr != null) {
            var element = document.getElementById(shaderAttr.value);
            if (element instanceof TSGLShaderElement) {
                this._material = new Material(element.shader);
                var properties = this.getProperties();
                this._material.properties = properties;
            }
        }
    };
    return TSGLMaterialElement;
}(TSGLElement));
var TSGLMeshElement = (function (_super) {
    __extends(TSGLMeshElement, _super);
    function TSGLMeshElement() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TSGLMeshElement.prototype, "mesh", {
        get: function () {
            if (this._mesh == null)
                this.loadAsset();
            return this._mesh;
        },
        enumerable: true,
        configurable: true
    });
    TSGLMeshElement.prototype.loadAsset = function () {
        var srcAttr = this.attributes.getNamedItem("src");
        if (srcAttr != null) {
            this._mesh = Mesh.fromFile(srcAttr.value);
        }
    };
    return TSGLMeshElement;
}(HTMLElement));
var TSGLShaderElement = (function (_super) {
    __extends(TSGLShaderElement, _super);
    function TSGLShaderElement() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TSGLShaderElement.prototype, "shader", {
        get: function () {
            if (this._shader == null)
                this.loadAsset();
            return this._shader;
        },
        enumerable: true,
        configurable: true
    });
    TSGLShaderElement.prototype.loadAsset = function () {
        var vertSrcAttr = this.attributes.getNamedItem("vert-src");
        var fragSrcAttr = this.attributes.getNamedItem("frag-src");
        if (vertSrcAttr != null && fragSrcAttr != null) {
            this._shader = new Shader("Hello", vertSrcAttr.value, fragSrcAttr.value);
        }
    };
    return TSGLShaderElement;
}(HTMLElement));
var TSGLTextureElement = (function (_super) {
    __extends(TSGLTextureElement, _super);
    function TSGLTextureElement() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TSGLTextureElement.prototype, "texture", {
        get: function () {
            if (this._texture == null)
                this.loadAsset();
            return this._texture;
        },
        enumerable: true,
        configurable: true
    });
    TSGLTextureElement.prototype.loadAsset = function () {
        var srcAttr = this.attributes.getNamedItem("src");
        if (srcAttr != null) {
            this._texture = Texture.fromFile(srcAttr.value);
        }
    };
    return TSGLTextureElement;
}(HTMLElement));
var TSGLComponentElement = (function (_super) {
    __extends(TSGLComponentElement, _super);
    function TSGLComponentElement() {
        _super.apply(this, arguments);
    }
    TSGLComponentElement.prototype.buildComponent = function () {
        var typeAttr = this.attributes.getNamedItem("type");
        if (typeAttr != null) {
            switch (typeAttr.value) {
                case "transform":
                    var transform = new Transform();
                    var properties = this.getProperties();
                    if ("position" in properties)
                        transform.position = properties["position"];
                    if ("x" in properties)
                        transform.position.x = properties["x"];
                    if ("y" in properties)
                        transform.position.y = properties["y"];
                    if ("z" in properties)
                        transform.position.z = properties["z"];
                    return transform;
                case "renderable":
                    var renderable = new Renderable();
                    var properties = this.getProperties();
                    if ("mesh" in properties)
                        renderable.mesh = properties["mesh"];
                    if ("material" in properties)
                        renderable.material = properties["material"];
                    return renderable;
                case "light":
                    var light = new Light(new Color(1, 1, 1, 1), 1.0, 10.0);
                    var properties = this.getProperties();
                    if ("color" in properties)
                        light.color = properties["color"];
                    if ("intensity" in properties)
                        light.intensity = properties["intensity"];
                    if ("range" in properties)
                        light.range = properties["range"];
                    return light;
                case "camera":
                    var camera = new Camera(60, 1.777);
                    var properties = this.getProperties();
                    if ("fov" in properties)
                        camera.fieldOfView = properties["fov"];
                    if ("aspect" in properties)
                        camera.aspect = properties["aspect"];
                    return camera;
                default:
                    console.error("Attempting to instantiate unknown component from DOM Element");
                    return null;
            }
        }
    };
    return TSGLComponentElement;
}(TSGLElement));
var TSGLEntityElement = (function (_super) {
    __extends(TSGLEntityElement, _super);
    function TSGLEntityElement() {
        _super.apply(this, arguments);
        this.entity = null;
    }
    TSGLEntityElement.prototype.buildEntity = function () {
        this.entity = new Entity();
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child instanceof TSGLComponentElement)
                this.entity.addComponent(child.buildComponent());
        }
        return this.entity;
    };
    return TSGLEntityElement;
}(TSGLElement));
var TSGLPropertyElement = (function (_super) {
    __extends(TSGLPropertyElement, _super);
    function TSGLPropertyElement() {
        _super.apply(this, arguments);
        this.type = null;
        this.key = null;
        this.value = null;
    }
    TSGLPropertyElement.prototype.createdCallback = function () {
        var typeAttr = this.attributes.getNamedItem("type");
        if (typeAttr != null)
            this.type = typeAttr.value;
        var keyAttr = this.attributes.getNamedItem("name");
        if (keyAttr != null)
            this.key = keyAttr.value;
    };
    TSGLPropertyElement.prototype.getValue = function () {
        if (this.value != null)
            return this.value;
        var valueAttr = this.attributes.getNamedItem("value");
        if (valueAttr != null) {
            switch (this.type) {
                case "number":
                    this.value = Number(valueAttr.value);
                    break;
                case "vector":
                    var components = valueAttr.value.split(/[,\s]/);
                    this.value = new Vec3(Number(components[0]), Number(components[1]), Number(components[2]));
                    break;
                case "color":
                    this.value = Color.fromHex(valueAttr.value);
                    break;
                case "material":
                    var element = document.getElementById(valueAttr.value);
                    if (element instanceof TSGLMaterialElement)
                        this.value = element.material;
                    break;
                case "mesh":
                    var element = document.getElementById(valueAttr.value);
                    if (element instanceof TSGLMeshElement)
                        this.value = element.mesh;
                    break;
                case "texture":
                    var element = document.getElementById(valueAttr.value);
                    if (element instanceof TSGLTextureElement)
                        this.value = element.texture;
                    break;
                case "cubemap":
                    var element = document.getElementById(valueAttr.value);
                    if (element instanceof TSGLCubemapElement)
                        this.value = element.cubemap;
                    break;
                default:
                    console.warn("tsgl-property element defined with unknown type: " + this.type);
            }
            return this.value;
        }
    };
    return TSGLPropertyElement;
}(HTMLElement));
var TSGLSceneElement = (function (_super) {
    __extends(TSGLSceneElement, _super);
    function TSGLSceneElement() {
        _super.apply(this, arguments);
        this.scene = null;
    }
    TSGLSceneElement.prototype.buildScene = function () {
        this.scene = new Scene();
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child instanceof TSGLSystemElement)
                this.scene.addSystem(child.system);
        }
        var entities = TSGLElement.buildEntityHierarchy(this);
        for (var i = 0; i < entities.length; i++) {
            this.scene.addEntity(entities[i]);
        }
        return this.scene;
    };
    return TSGLSceneElement;
}(TSGLElement));
var TSGLSystemElement = (function (_super) {
    __extends(TSGLSystemElement, _super);
    function TSGLSystemElement() {
        _super.apply(this, arguments);
    }
    TSGLSystemElement.prototype.createdCallback = function () {
        var typeAttr = this.attributes.getNamedItem("type");
        if (typeAttr != null) {
            switch (typeAttr.value) {
                case "renderer":
                    this.system = new Renderer();
                    break;
                default:
                    console.error("Attempting to instantiate unknown system from DOM Element");
            }
        }
    };
    return TSGLSystemElement;
}(TSGLElement));
//# sourceMappingURL=tsc.js.map