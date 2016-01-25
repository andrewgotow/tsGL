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
        this.onReady = function () { };
    }
    return Asset;
})();
var Material = (function (_super) {
    __extends(Material, _super);
    function Material(shader) {
        _super.call(this);
        this.shader = shader;
        this.properties = {};
        this.onReady();
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
})(Asset);
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
            mesh.onReady();
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
            console.error("Attempting to access VBO of Mesh asset before it has been created.");
        return this._vbo;
    };
    Mesh.prototype.getEbo = function () {
        if (this._ebo == null)
            console.error("Attempting to access EBO of Mesh asset before it has been created.");
        return this._ebo;
    };
    return Mesh;
})(Asset);
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
            shader.onReady();
        }, function (url) {
            alert('Failed to download shader program "' + url + '"');
        });
    };
    Shader.prototype.useProgram = function () {
        GL.context.useProgram(this._program);
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
    Shader.prototype.setUniform = function (key, value) {
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
                    GL.context.activeTexture(GL.context.TEXTURE0);
                    GL.context.bindTexture(GL.context.TEXTURE_2D, value.getTextureId());
                    GL.context.uniform1i(loc, value.getTextureId());
                    break;
                default:
                    console.error("Attempting to assign unknown type to shader uniform \"" + key + "\", in shader \"" + this.name + "\".");
            }
        }
        else {
            console.error("Attempting to assign unknown uniform to shader \"" + key + "\", in shader \"" + this.name + "\".");
        }
    };
    return Shader;
})(Asset);
var Texture = (function (_super) {
    __extends(Texture, _super);
    function Texture() {
        _super.call(this);
        this._texture = null;
    }
    Texture.fromFile = function (url) {
        var tex = new Texture();
        tex.url = url;
        tex._texture = GL.context.createTexture();
        var img = new Image();
        img.onload = function () {
            GL.context.bindTexture(GL.context.TEXTURE_2D, tex._texture);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_MAG_FILTER, GL.context.LINEAR);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_MIN_FILTER, GL.context.LINEAR_MIPMAP_NEAREST);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_S, GL.context.REPEAT);
            GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_T, GL.context.REPEAT);
            GL.context.texImage2D(GL.context.TEXTURE_2D, 0, GL.context.RGBA, GL.context.RGBA, GL.context.UNSIGNED_BYTE, img);
            GL.context.generateMipmap(GL.context.TEXTURE_2D);
            GL.context.bindTexture(GL.context.TEXTURE_2D, null);
            tex.onReady();
        };
        img.src = tex.url;
        return tex;
    };
    Texture.prototype._unload = function () {
        GL.context.deleteTexture(this._texture);
    };
    Texture.prototype.getTextureId = function () {
        if (this._texture == null)
            console.error("Attempting to use Texture asset before it has been loaded.");
        return this._texture;
    };
    return Texture;
})(Asset);
var Component = (function () {
    function Component() {
    }
    return Component;
})();
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(fov, resolution) {
        _super.call(this);
        this.fieldOfView = fov;
        this.resolution = resolution;
        this.near = 0.1;
        this.far = 100;
        this._projection = null;
        this._buildProjection();
    }
    Camera.prototype._buildProjection = function () {
        this._projection = Mat4.makePerspective(this.fieldOfView, this.resolution.x / this.resolution.y, this.near, this.far);
    };
    Camera.prototype.getProjection = function () {
        if (this._projection == null)
            this._buildProjection();
        return this._projection;
    };
    return Camera;
})(Component);
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
})(Component);
var Renderable = (function (_super) {
    __extends(Renderable, _super);
    function Renderable() {
        _super.call(this);
        this.material = null;
        this.mesh = null;
    }
    return Renderable;
})(Component);
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
})(Component);
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
    return Entity;
})();
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
})();
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
})();
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
            GL.context.clearColor(0.5, 0.5, 0.5, 1.0);
            GL.context.clear(GL.context.COLOR_BUFFER_BIT | GL.context.DEPTH_BUFFER_BIT);
            for (var rendIndex = 0; rendIndex < this._renderables.length; rendIndex++) {
                var renderable = this._renderables[rendIndex];
                if (renderable.material == null) {
                    console.warn("Renderable component has no material assigned");
                    continue;
                }
                if (renderable.mesh == null) {
                    console.warn("Renderable component has no mesh assigned");
                    continue;
                }
                var modelMat = renderable.entity.getComponent("Transform").getMatrix();
                var modelViewMat = Mat4.mul(modelMat, viewMat);
                renderable.material.properties["uModelViewMatrix"] = modelViewMat;
                renderable.material.properties["uProjection"] = projectionMat;
                renderable.material.properties["uNormalMatrix"] = Mat4.transpose(Mat4.invert(modelViewMat));
                renderable.material.useMaterial();
                GL.context.bindBuffer(GL.context.ARRAY_BUFFER, renderable.mesh.getVbo());
                GL.context.vertexAttribPointer(renderable.material.shader.attributes["vPosition"], 3, GL.context.FLOAT, false, 0, 0);
                GL.context.vertexAttribPointer(renderable.material.shader.attributes["vNormal"], 3, GL.context.FLOAT, true, 0, 4 * (renderable.mesh.positions.length));
                GL.context.vertexAttribPointer(renderable.material.shader.attributes["vTexcoord"], 2, GL.context.FLOAT, false, 0, 4 * (renderable.mesh.positions.length + renderable.mesh.normals.length));
                GL.context.enableVertexAttribArray(renderable.material.shader.attributes["vPosition"]);
                GL.context.enableVertexAttribArray(renderable.material.shader.attributes["vNormal"]);
                GL.context.enableVertexAttribArray(renderable.material.shader.attributes["vTexcoord"]);
                GL.context.bindBuffer(GL.context.ELEMENT_ARRAY_BUFFER, renderable.mesh.getEbo());
                GL.context.drawElements(GL.context.TRIANGLES, renderable.mesh.triangles.length, GL.context.UNSIGNED_SHORT, 0);
            }
        }
    };
    return Renderer;
})(System);
var GL = (function () {
    function GL() {
    }
    GL.init = function (canvas) {
        try {
            GL.context = canvas.getContext("webgl");
        }
        catch (e) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
        if (GL.context) {
            GL.context.enable(GL.context.DEPTH_TEST);
            GL.context.depthFunc(GL.context.LEQUAL);
            GL.context.viewport(0, 0, canvas.width, canvas.height);
        }
    };
    return GL;
})();
function start() {
    Scene.loadSceneWithId("scene1");
}
var Color = (function () {
    function Color(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
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
})();
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
        var inv = new Float32Array(16);
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
})();
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
})();
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
})();
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
            var shaderElement = document.getElementById(shaderAttr.value);
            if (shaderElement instanceof TSGLShaderElement) {
                this._material = new Material(shaderElement.shader);
                var children = this.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (child instanceof TSGLPropertyElement)
                        this._material.properties[child.key] = child.value;
                    if (child instanceof TSGLTextureElement)
                        this._material.properties[child.name] = child.texture;
                }
            }
        }
    };
    return TSGLMaterialElement;
})(HTMLElement);
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
})(HTMLElement);
var TSGLPropertyElement = (function (_super) {
    __extends(TSGLPropertyElement, _super);
    function TSGLPropertyElement() {
        _super.apply(this, arguments);
    }
    TSGLPropertyElement.prototype.createdCallback = function () {
        var keyAttr = this.attributes.getNamedItem("name");
        var valueAttr = this.attributes.getNamedItem("value");
        if (keyAttr != null && valueAttr != null) {
            this.key = keyAttr.value;
            this.value = valueAttr.value;
        }
    };
    return TSGLPropertyElement;
})(HTMLElement);
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
})(HTMLElement);
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
    TSGLTextureElement.prototype.createdCallback = function () {
        var nameAttr = this.attributes.getNamedItem("name");
        if (nameAttr != null) {
            this.name = nameAttr.value;
        }
    };
    return TSGLTextureElement;
})(HTMLElement);
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
                    transform.position = new Vec3(Number(this.attributes.getNamedItem("x").value), Number(this.attributes.getNamedItem("y").value), Number(this.attributes.getNamedItem("z").value));
                    return transform;
                case "renderable":
                    var renderable = new Renderable();
                    var meshAttr = this.attributes.getNamedItem("mesh");
                    if (meshAttr != null) {
                        var element = document.getElementById(meshAttr.value);
                        if (element instanceof TSGLMeshElement) {
                            renderable.mesh = element.mesh;
                        }
                    }
                    var materialAttr = this.attributes.getNamedItem("material");
                    if (materialAttr != null) {
                        var element = document.getElementById(materialAttr.value);
                        if (element instanceof TSGLMaterialElement) {
                            renderable.material = element.material;
                        }
                    }
                    return renderable;
                case "camera":
                    return new Camera(60, new Vec3(100.0, 100.0, 0));
                default:
                    console.error("Attempting to instantiate unknown component from DOM Element");
                    return null;
            }
        }
    };
    return TSGLComponentElement;
})(HTMLElement);
var TSGLEntityElement = (function (_super) {
    __extends(TSGLEntityElement, _super);
    function TSGLEntityElement() {
        _super.apply(this, arguments);
    }
    TSGLEntityElement.prototype.buildEntity = function () {
        var entity = new Entity();
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child instanceof TSGLComponentElement)
                entity.addComponent(child.buildComponent());
        }
        return entity;
    };
    return TSGLEntityElement;
})(HTMLElement);
var TSGLSceneElement = (function (_super) {
    __extends(TSGLSceneElement, _super);
    function TSGLSceneElement() {
        _super.apply(this, arguments);
    }
    TSGLSceneElement.prototype.buildScene = function () {
        var scene = new Scene();
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child instanceof TSGLEntityElement)
                scene.addEntity(child.buildEntity());
            if (child instanceof TSGLSystemElement)
                scene.addSystem(child.system);
        }
        return scene;
    };
    return TSGLSceneElement;
})(HTMLElement);
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
})(HTMLElement);
//# sourceMappingURL=tsc.js.map