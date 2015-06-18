  var requestFullScreen = function(element) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) {
        requestMethod.call(element);
    }
  };
  

  var Ghost = function() {
    var shape, cover;
    shape = new THREE.CylinderGeometry(50,60,100);
    cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0.5, 0.5, 1);
    this.body = new THREE.Mesh(shape, cover);
    this.body.castShadow = true;
  
    shape = new THREE.SphereGeometry(50, 10, 10);
    cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0.5, 0.5, 1);
    this.head = new THREE.Mesh(shape, cover);
    this.body.add(this.head);
    this.head.castShadow = true;
  
    shape = new THREE.TorusGeometry(100, 15, 10, 25, 2.14);
    cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0.5, 0.5, 1);
    this.arms = new THREE.Mesh(shape, cover);
    this.body.add(this.arms);
    this.arms.castShadow = true;
    
    this.animate = function(t) {
      ghost.head.position.set(0, 50 + 5*Math.sin(10*t), 0);
      ghost.arms.position.set(0, - 50 - 5*Math.sin(10*t), 0);
      ghost.arms.rotation.set(0, 0, 0.5);
      ghost.body.position.set(100*Math.sin(t), 90*Math.cos(t),200*Math.sin(t));
    };
  };
  
  var Critter = function() {
    this.running = false;
    this.offset = 0;
    
    var shape, cover;
    this.surface = new THREE.MeshPhongMaterial();
    this.surface.emissive.setRGB(0.93, 0.8, 0.67);
    this.skin = Physijs.createMaterial(this.surface, 0.9, 0.2);
    
    shape = new THREE.SphereGeometry(36, 36, 36);
    this.body = new Physijs.BoxMesh(shape, this.skin);
    this.body.castShadow = true;
    
    shape = new THREE.SphereGeometry(24, 20, 20);
    this.head = new THREE.Mesh(shape, this.skin);
    this.head.castShadow = true;
    this.body.add(this.head);
    this.head.position.set(0, 20, 35);
    
    this.frontFeet = new THREE.Object3D();
    this.body.add(this.frontFeet);
    this.frontFeet.position.set(0, -30, 20);
    
    shape = new THREE.SphereGeometry(10, 15, 15);
    this.foot1 = new Physijs.BoxMesh(shape, this.skin);
    this.foot1.castShadow = true;
    this.frontFeet.add(this.foot1);
    this.foot1.position.set(-15, 0, 0);
    
    shape = new THREE.SphereGeometry(10, 15, 15);
    this.foot2 = new Physijs.BoxMesh(shape, this.skin);
    this.foot2.castShadow = true;
    this.frontFeet.add(this.foot2);
    this.foot2.position.set(15, 0, 0);
    
    this.backFeet = new THREE.Object3D();
    this.body.add(this.backFeet);
    this.backFeet.position.set(0, -27, -20);
    
    shape = new THREE.SphereGeometry(13, 15, 15);
    this.foot3 = new Physijs.BoxMesh(shape, this.skin);
    this.foot3.castShadow = true;
    this.backFeet.add(this.foot3);
    this.foot3.position.set(-17, 0, 0);
    
    shape = new THREE.SphereGeometry(13, 15, 15);
    this.foot4 = new Physijs.BoxMesh(shape, this.skin);
    this.foot4.castShadow = true;
    this.backFeet.add(this.foot4);
    this.foot4.position.set(17, 0, 0);
  };
  
  // run is called when we start moving the character
  // animate below is called in the slow (animate) loop
  // gallop gets called from animate while the character is still moving
  
  Critter.prototype.run = function(t, sidemotion) {
    if(!this.running) {
      this.offset = -t;
      this.running = true;
      this.sidemotion = sidemotion;
console.log(sidemotion);
      var thrust = 0.1;
      var f1 = new THREE.Vector3();
      var f2 = new THREE.Vector3();
      var force = new THREE.Vector3();

      f1.getPositionFromMatrix(this.foot1.matrixWorld);
      f2.getPositionFromMatrix(this.foot2.matrixWorld);
      force.sub(f1, f2);
      force.multiplyScalar(self.sidemotion * thrust);
      //this.body.applyImpulse(force, f1); // makes the character hop out of the scene
    }
  };
    
  Critter.prototype.animate = function(t) {
    var stopped = 0.9 * Math.PI;
    var paced = 8*(t + this.offset - stopped);
    if(this.running) {
      if(paced < 4*Math.PI) {
        this.gallop(paced, stopped);
      } else {
        this.running = false;
        this.looking = true;
      }
    } else if(this.looking) {
      if(paced < 12 * Math.PI) {
        this.head.rotation.y = Math.sin(paced/4);
      } else {
        this.head.rotation.y = 0;
        this.looking = false;
      }
    }
  };
  
  Critter.prototype.gallop = function(paced, stopped) {
    var thrust;
    if(true) { // lift the critter while he's galloping
      thrust = 10 * Math.sin(paced + 0.66 + stopped);
      this.body.applyCentralImpulse(new THREE.Vector3(0, 4 * 1e6 * thrust, 1e6 * thrust));
      this.body.rotation.x = 5 * Math.sin(paced);
    }
    this.backFeet.position.y = -25 + 10*Math.sin(paced + 2.87 + stopped);
    this.backFeet.position.z = -20 + 10*Math.sin(paced + 2.87 + stopped);
    this.frontFeet.position.y = -30 + 7*Math.sin(paced + 0.66 + stopped);
  };

  var Bunny = function() {
    Critter.call(this);

    shape = new THREE.SphereGeometry(10, 10, 10);
    this.tail = new THREE.Mesh(shape, this.skin);
    this.tail.castShadow = true;
    this.body.add(this.tail);
    this.tail.position.set(0, 0, -43);
    
    // black eyes
    
    var cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0, 0, 0);
    shape = new THREE.SphereGeometry(5, 5, 5);
    this.eye1 = new THREE.Mesh(shape, cover);
    this.head.add(this.eye1);
    this.eye1.position.set(-10, 10, 20);
    
    cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0, 0, 0);
    shape = new THREE.SphereGeometry(5, 5, 5);
    this.eye2 = new THREE.Mesh(shape, cover);
    this.head.add(this.eye2);
    this.eye2.position.set(10, 10, 20);
    
    // pink nose
    
    cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0.8, 0.3, 0.3);
    shape = new THREE.SphereGeometry(5, 5, 5);
    this.eye1 = new THREE.Mesh(shape, cover);
    this.head.add(this.eye1);
    this.eye1.position.set(0, 0, 25);
  
    // ears

    var points = [];
    var pcount = 16;
    for(var i = 0; i < pcount; i++)
      points.push(new THREE.Vector3(Math.sqrt(25 * (Math.sin(i * 0.2 ) + 0.2 * Math.sin(i * 0.4))), 0, 45-3 * i));
    shape = new THREE.LatheGeometry(points);
    this.ear1 = new THREE.Mesh(shape, this.skin);
    this.ear1.castShadow = true;
    this.head.add(this.ear1);
    this.ear1.rotation.x = -Math.PI/2;
    this.ear1.position.set(10, 20, 10);
    this.ear2 = new THREE.Mesh(shape, this.skin);
    this.ear2.castShadow = true;
    this.head.add(this.ear2);
    this.ear2.rotation.x = -Math.PI/2;
    this.ear2.position.set(-10, 20, 10);
  };
  Bunny.prototype = Object.create(Critter.prototype);
  Bunny.prototype.constructor = Bunny;

  Bunny.prototype.gallop = function(paced, stopped) {
    Critter.prototype.gallop.call(this, paced, stopped);
    this.ear1.rotation.y = 0.2 + 0.25 * Math.sin(paced + 2.04 + stopped);
    this.ear2.rotation.y = -0.2 -0.25 * Math.sin(paced + 2.04 + stopped);
  };
  
  var Frog = function() {
    Critter.call(this);   
  
    // black eyes
    
    var cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0, 0, 0);
    shape = new THREE.SphereGeometry(5, 5, 5);
    this.eye1 = new THREE.Mesh(shape, cover);
    this.head.add(this.eye1);
    this.eye1.position.set(-15, 15, 10);
    
    cover = new THREE.MeshPhongMaterial();
    cover.emissive.setRGB(0, 0, 0);
    shape = new THREE.SphereGeometry(5, 5, 5);
    this.eye2 = new THREE.Mesh(shape, cover);
    this.head.add(this.eye2);
    this.eye2.position.set(15, 15, 10);
    
    this.surface.emissive.setRGB(0.5, 0.9, 0.25);
  }
  Frog.prototype = Object.create(Critter.prototype);
  Frog.prototype.constructor = Frog;

  Physijs.scripts.ammo = 'http://gamingJS.com/ammo.js';
  Physijs.scripts.worker = 'http://gamingJS.com/physijs_worker.js';

  var scene = new Physijs.Scene({ fixedTimeStep: 2 / 60 });
  scene.setGravity(new THREE.Vector3( 0, -100, 0 ));

  var separation = 10; // positive for tv viewing
  var smoothness = 20; // in fps up to 60
  var keys = [];
  var in3d = true;
  
  in3d = false;
  
  var cameras = new THREE.Object3D();
  var lookingAtPoint = new THREE.Vector3(0,0,-1000);
  scene.add(cameras);
  cameras.position.set(0, 0, 700);
  
  cameraLeft = new THREE.PerspectiveCamera(45, 1, 1, 4000);
  cameras.add(cameraLeft);
  cameraLeft.lookAt(lookingAtPoint);
  cameraLeft.position.set(-separation, 0, 0);

  cameraRight = new THREE.PerspectiveCamera(45, 1, 1, 4000);
  cameras.add(cameraRight);
  cameraRight.lookAt(lookingAtPoint);
  cameraRight.position.set(separation, 0, 0);

  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.shadowMapEnabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // ghost wall
  shape = new THREE.PlaneGeometry(600, 400);
  cover = new THREE.MeshBasicMaterial();
  cover.color.setRGB(0.5, 0.5, 0.5);
  var wall = new THREE.Mesh(shape, cover);
  scene.add(wall);
  wall.rotation.set(0, 0.5, 0);
  wall.receiveShadow = true;
  
  // floor
  shape = new THREE.CubeGeometry(5000, 10, 5000);
  cover = new THREE.MeshBasicMaterial();
  cover.color.setRGB(0.8, 0.5, 0.3);
  var floor = new Physijs.BoxMesh(shape, cover, 0);
  floor.position.set(0, -100, 0);
  scene.add(floor);
  
  // maze
  shape = new THREE.CubeGeometry(500, 400, 50);
  cover = new THREE.MeshBasicMaterial();
  cover.color.setRGB(0.0, 1.0, 0.0);
  var mazewall = new Physijs.BoxMesh(shape, cover);
  mazewall.position.set(0, 200, 0);
  scene.add(mazewall);

  var ghost = new Ghost();
  scene.add(ghost.body);
  
  var bunnies = [];
  for(var i = 0; i < 1; i++) {
    var bunny = new Bunny();
    bunnies.push(bunny);
    bunny.body.position.set(500, 25, 100);
    scene.add(bunny.body);
  }
  var frogs = [];
  for(var i = 0; i < 1; i++) {
    var frog = new Frog();
    frogs.push(frog);
    frog.body.position.set(-500, 25, 100);
    scene.add(frog.body);
  }
  
  var candle = new THREE.DirectionalLight();
  candle.intensity = 0.2;
  candle.position.set(0, -120, 300);
  scene.add(candle);
  candle.castShadow = true;
  
  //requestFullScreen(document.body);
  scene.updateMatrixWorld(true);
  
  document.addEventListener('keydown', function(event) {
    var key = event.keyCode;
    keys[key] = 1;
    //alert(key);
  });
  
  document.addEventListener('keyup', function(event) {
    var key = event.keyCode;
    keys[key] = 0;
  });
  
  function animate() {
    var t = clock.getElapsedTime();
    
    // move the camera in the scene
    if(keys[37])
      cameras.rotation.y += 0.1;
    if(keys[38])
      cameras.translateZ(-50);
    if(keys[39])
      cameras.rotation.y += -0.1;
    if(keys[40])
      cameras.translateZ(50);
    
    ghost.animate(t);
    
    
    if(keys[87]) {
      bunnies[0].run(t, 0);
    }
    if(keys[65]) {
      // turning left
      bunnies[0].run(t, -1);
    }
    if(keys[68]){
      bunnies[0].run(t, 1);
    }
    
    if(keys[89]){
      frogs[0].run(t, 0);
    }
    if(keys[71]) {
      frogs[0].run(t, -1);
    }
    if(keys[74]){
      frogs[0].run(t, 1);
    }
    
    bunnies.forEach(function(bunny) {
      if(keys[90]) bunny.run(t, 0);
      bunny.animate(t);
    });
    frogs.forEach(function(frog) {
      if(keys[90]) frog.run(t, 0);
      frog.animate(t);
    });
    
    scene.simulate();
  }
  var clock = new THREE.Clock();
  function render() {
    
    if(smoothness >= 60) requestAnimationFrame(render);
    
    var height = window.innerHeight;
    var width;
    if(in3d) {
      width = Math.round(window.innerWidth/2);
      cameraLeft.aspect = width * 2 / height;
    } else {
      width = window.innerWidth;
      cameraLeft.aspect = width / height;
    }

    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(0, 0, width, height);
    renderer.enableScissorTest (true);

    cameraLeft.updateProjectionMatrix();
    renderer.render(scene, cameraLeft);

    if(in3d) {
      renderer.setViewport(width, 0, width, height);
      renderer.setScissor(width, 0, width, height);
      renderer.enableScissorTest ( true );

      cameraRight.aspect = width * 2 / height;
      cameraRight.updateProjectionMatrix();

      renderer.render( scene, cameraRight );
    }
  }
  
  
  if(smoothness >= 60)
    render();
  else
    setInterval(render, 1000 / smoothness);

  setInterval(animate, 100);
