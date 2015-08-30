// Generated by CoffeeScript 1.8.0
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["three", "physi", "bunnies"], function(THREE, Physijs, bunnies) {
  return new ((function() {
    function _Class() {
      this.render = __bind(this.render, this);
      this.animate = __bind(this.animate, this);
    }

    _Class.prototype.size = function() {
      var height, width;
      height = window.innerHeight;
      width = window.innerWidth;
      this.renderer.setSize(width, height);
      this.height = this.renderer.domElement.height;
      return this.width = this.renderer.domElement.width;
    };

    _Class.prototype.init = function() {
      var bunny, candle, cover, floor, frog, i, lookingAtPoint, mazewall, orientationEvent, separation, shape, sky, skyMaterial, supportsOrientationChange, wall;
      Physijs.scripts.ammo = "../ammo.js/builds/ammo.js";
      Physijs.scripts.worker = "../bower_components/physijs/physijs_worker.js";
      this.scene = new Physijs.Scene({
        fixedTimeStep: 2 / 60
      });
      this.scene.setGravity(new THREE.Vector3(0, -100, 0));
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.size();
      supportsOrientationChange = __indexOf.call(window, 'onorientationchange') >= 0;
      orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
      window.addEventListener(orientationEvent, ((function(_this) {
        return function() {
          return _this.size();
        };
      })(this)), false);
      document.body.appendChild(this.renderer.domElement);
      this.smoothness = 60;
      this.keys = [];
      this.in3d = 1;
      separation = 10;
      this.cameras = new THREE.Object3D();
      lookingAtPoint = new THREE.Vector3(0, 0, -1000);
      this.scene.add(this.cameras);
      this.cameras.position.set(0, 0, 700);
      this.cameraLeft = new THREE.PerspectiveCamera(45, 1, 1, 14000);
      this.cameras.add(this.cameraLeft);
      this.cameraLeft.lookAt(lookingAtPoint);
      this.cameraLeft.position.set(-separation, 0, 0);
      this.cameraRight = new THREE.PerspectiveCamera(45, 1, 1, 14000);
      this.cameras.add(this.cameraRight);
      this.cameraRight.lookAt(lookingAtPoint);
      this.cameraRight.position.set(separation, 0, 0);
      shape = new THREE.PlaneGeometry(600, 400);
      cover = new THREE.MeshBasicMaterial();
      cover.color.setRGB(0.5, 0.5, 0.5);
      wall = new THREE.Mesh(shape, cover);
      this.scene.add(wall);
      wall.rotation.set(0, 0.5, 0);
      wall.receiveShadow = true;
      shape = new THREE.CubeGeometry(5000, 10, 5000);
      cover = new THREE.MeshBasicMaterial();
      cover.color.setRGB(0.8, 0.5, 0.3);
      floor = new Physijs.BoxMesh(shape, cover, 0);
      floor.position.set(0, -100, 0);
      this.scene.add(floor);
      shape = new THREE.CubeGeometry(500, 400, 50);
      cover = new THREE.MeshBasicMaterial();
      cover.color.setRGB(0.0, 1.0, 0.0);
      mazewall = new Physijs.BoxMesh(shape, cover);
      mazewall.position.set(0, 200, 0);
      this.scene.add(mazewall);
      skyMaterial = new THREE.MeshBasicMaterial();
      skyMaterial.color.setRGB(0, 0, 0.5);
      skyMaterial.side = THREE.DoubleSide;
      sky = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1, null, true), skyMaterial);
      this.scene.add(sky);
      this.ghost = new Ghost();
      this.scene.add(this.ghost.body);
      this.bunnies = [];
      i = 0;
      while (i < 1) {
        bunny = new Bunny();
        this.bunnies.push(bunny);
        bunny.body.position.set(500, 25, -200);
        this.scene.add(bunny.body);
        i++;
      }
      this.frogs = [];
      i = 0;
      while (i < 1) {
        frog = new Frog();
        this.frogs.push(frog);
        frog.body.position.set(-500, 25, 100);
        this.scene.add(frog.body);
        i++;
      }
      candle = new THREE.DirectionalLight();
      candle.intensity = 0.2;
      candle.position.set(0, -120, 300);
      this.scene.add(candle);
      candle.castShadow = true;
      this.scene.updateMatrixWorld(true);
      this.forward = 90;
      this.turn = 0;
      document.addEventListener("keydown", (function(_this) {
        return function(event) {
          var key;
          key = event.keyCode;
          return _this.keys[key] = 1;
        };
      })(this));
      document.addEventListener("keyup", (function(_this) {
        return function(event) {
          var key;
          key = event.keyCode;
          return _this.keys[key] = 0;
        };
      })(this));
      window.addEventListener('deviceorientation', ((function(_this) {
        return function(event) {
          var beta, gamma, _ref;
          return _ref = _this.width < _this.height ? [event.beta, event.gamma] : (beta = -event.gamma, gamma = event.beta, Math.abs(gamma) > 90 ? beta = 180 - beta : void 0, [beta, gamma]), _this.forward = _ref[0], _this.side = _ref[1], _ref;
        };
      })(this)), true);
      this.axis = new THREE.Vector3(1, 0, 0);
      this.clock = new THREE.Clock();
      return this.turn = 0;
    };

    _Class.prototype.animate = function() {
      var compass, rotation, t;
      t = this.clock.getElapsedTime();
      rotation = (this.forward - 90) * 3.14 / 180;
      if (this.printed !== Math.floor(t / 10)) {
        this.printed = Math.floor(t / 10);
        console.log("tilt: " + this.forward + "," + this.side + "," + t);
      }
      this.turn += this.side < -20 ? 1 : this.side > 20 ? -1 : 0;
      compass = this.turn * 3.14 / 180;
      this.cameras.rotation.set(0, compass, 0);
      if (this.forward < 75) {
        this.cameras.translateZ(-25);
      } else if (this.forward > 105) {
        this.cameras.translateZ(25);
      }
      if (this.keys[37]) {
        this.turn += 3;
      }
      if (this.keys[38]) {
        this.cameras.translateZ(-50);
      }
      if (this.keys[39]) {
        this.turn -= 3;
      }
      if (this.keys[40]) {
        this.cameras.translateZ(50);
      }
      this.cameras.rotateOnAxis(this.axis, rotation);
      this.ghost.animate(t);
      this.bunnies.forEach((function(_this) {
        return function(bunny) {
          if (_this.keys[90]) {
            bunny.run(t, 0);
          }
          return bunny.animate(t);
        };
      })(this));
      this.frogs.forEach((function(_this) {
        return function(frog) {
          if (_this.keys[90]) {
            frog.run(t, 0);
          }
          return frog.animate(t);
        };
      })(this));
      return this.scene.simulate();
    };

    _Class.prototype.render = function() {
      var width;
      if (this.smoothness >= 60) {
        requestAnimationFrame(this.render);
      }
      if (this.in3d) {
        width = Math.round(this.width / 2);
        this.cameraLeft.aspect = width * this.in3d / this.height;
        this.cameraRight.aspect = width * this.in3d / this.height;
      } else {
        width = this.width;
        this.cameraLeft.aspect = width / this.height;
      }
      this.renderer.setViewport(0, 0, width, this.height);
      this.renderer.setScissor(0, 0, width, this.height);
      this.renderer.enableScissorTest(true);
      this.cameraLeft.updateProjectionMatrix();
      this.renderer.render(this.scene, this.cameraLeft);
      if (this.in3d) {
        this.renderer.setViewport(width, 0, width, this.height);
        this.renderer.setScissor(width, 0, width, this.height);
        this.renderer.enableScissorTest(true);
        this.cameraRight.updateProjectionMatrix();
        return this.renderer.render(this.scene, this.cameraRight);
      }
    };

    _Class.prototype.runSimulation = function() {
      if (this.smoothness >= 60) {
        this.render();
      } else {
        setInterval(this.render, 500 / this.smoothness);
      }
      return setInterval(this.animate, 50);
    };

    return _Class;

  })());
});
