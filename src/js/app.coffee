define [
  "three"
  "physi"
  "bunnies"
], (THREE, Physijs, bunnies) ->

  new class
    size: ->
      height = window.innerHeight
      width = window.innerWidth
      @renderer.setSize width, height
      @height = @renderer.domElement.height
      @width = @renderer.domElement.width
      
    init: ->
      Physijs.scripts.ammo = "../ammo.js/builds/ammo.js"
      Physijs.scripts.worker = "../bower_components/physijs/physijs_worker.js"

      @scene = new Physijs.Scene(fixedTimeStep: 2 / 60)
      @scene.setGravity new THREE.Vector3(0, -100, 0)
      @renderer = new THREE.WebGLRenderer(antialias: true)
      @size()
      supportsOrientationChange = 'onorientationchange' in window
      orientationEvent = if supportsOrientationChange then 'orientationchange' else 'resize'
      window.addEventListener orientationEvent, ( => @size() ), false
      document.body.appendChild @renderer.domElement

      # fps up to 60
      @smoothness = 60
      @keys = []

      # 0 = no 3d; 1 = cardboard, preserve aspect; 2 = tv, adjust aspect
      @in3d = 1
      separation = 10
      @cameras = new THREE.Object3D()
      lookingAtPoint = new THREE.Vector3(0, 0, -1000)
      @scene.add @cameras
      @cameras.position.set 0, 0, 700
      @cameraLeft = new THREE.PerspectiveCamera(45, 1, 1, 4000)
      @cameras.add @cameraLeft
      @cameraLeft.lookAt lookingAtPoint
      @cameraLeft.position.set -separation, 0, 0
      @cameraRight = new THREE.PerspectiveCamera(45, 1, 1, 4000)
      @cameras.add @cameraRight
      @cameraRight.lookAt lookingAtPoint
      @cameraRight.position.set separation, 0, 0

      shape = new THREE.PlaneGeometry(600, 400)
      cover = new THREE.MeshBasicMaterial()
      cover.color.setRGB 0.5, 0.5, 0.5
      wall = new THREE.Mesh(shape, cover)
      @scene.add wall
      wall.rotation.set 0, 0.5, 0
      wall.receiveShadow = true
      shape = new THREE.CubeGeometry(5000, 10, 5000)
      cover = new THREE.MeshBasicMaterial()
      cover.color.setRGB 0.8, 0.5, 0.3
      floor = new Physijs.BoxMesh(shape, cover, 0)
      floor.position.set 0, -100, 0
      @scene.add floor
      shape = new THREE.CubeGeometry(500, 400, 50)
      cover = new THREE.MeshBasicMaterial()
      cover.color.setRGB 0.0, 1.0, 0.0
      mazewall = new Physijs.BoxMesh(shape, cover)
      mazewall.position.set 0, 200, 0
      @scene.add mazewall
      @ghost = new Ghost()
      @scene.add @ghost.body

      @bunnies = []
      i = 0
      while i < 1
        bunny = new Bunny()
        @bunnies.push bunny
        bunny.body.position.set 500, 25, -200
        @scene.add bunny.body
        i++

      @frogs = []
      i = 0
      while i < 1
        frog = new Frog()
        @frogs.push frog
        frog.body.position.set -500, 25, 100
        @scene.add frog.body
        i++

      candle = new THREE.DirectionalLight()
      candle.intensity = 0.2
      candle.position.set 0, -120, 300
      @scene.add candle
      candle.castShadow = true
      @scene.updateMatrixWorld true

      document.addEventListener "keydown", (event) =>
        key = event.keyCode
        @keys[key] = 1
        return

      document.addEventListener "keyup", (event) =>
        key = event.keyCode
        @keys[key] = 0
        return
        
      window.addEventListener 'deviceorientation', ((event) =>
        [forward, side] = if @width < @height
          # in portrait, these work as documented
          [event.beta, event.gamma]
        else
          # in landscape, they are reversed and scrambled
          beta = -event.gamma
          gamma = event.beta
          if(Math.abs(gamma) > 90)
            beta = 180 - beta
          [beta, gamma]
        rotation = (forward - 90) * 3.14 / 180
        compass = event.alpha * 3.14 / 180
        @cameras.rotation.y = compass
        @cameras.rotation.x = rotation * Math.cos compass
        @cameras.rotation.z = rotation * Math.sin compass
        @keys[37] ||= 0
        @keys[38] ||= 0
        @keys[39] ||= 0
        @keys[40] ||= 0
        if forward < -50
          @keys[40] += 1
          @keys[38] = 0
        else if forward > -10
          @keys[38] += 1
          @keys[40] = 0
        else
          @keys[38] = @keys[40] = 0
        if side < -15
          @keys[37] += 1
          @keys[39] = 0
        else if side > 15
          @keys[39] += 1
          @keys[37] = 0
        else
          @keys[37] = @keys[39] = 0
        ), true

      @clock = new THREE.Clock()

    pressed: (key) ->
      key > 0 && key < 100

    animate: =>
      t = @clock.getElapsedTime()
      
      # move the camera in the @scene
      #@cameras.rotation.y += 0.1  if @keys[37] # left
      #@cameras.translateZ -50  if @pressed(@keys[38]) # forward
      #@cameras.rotation.y += -0.1  if @keys[39] # right
      #@cameras.translateZ 50  if @pressed(@keys[40]) # reverse
      
      @ghost.animate t
      @bunnies[0].run t, 0  if @keys[87]
      @bunnies[0].run t, -1  if @keys[65]
      @bunnies[0].run t, 1  if @keys[68]
      @frogs[0].run t, 0  if @keys[89]
      @frogs[0].run t, -1  if @keys[71]
      @frogs[0].run t, 1  if @keys[74]
      @bunnies.forEach (bunny) =>
        bunny.run t, 0  if @keys[90]
        bunny.animate t
        return

      @frogs.forEach (frog) =>
        frog.run t, 0  if @keys[90]
        frog.animate t
        return

      @scene.simulate()

    render: =>
      requestAnimationFrame @render if @smoothness >= 60
      if @in3d
        width = Math.round(@width / 2)
        @cameraLeft.aspect = width * @in3d / @height
        @cameraRight.aspect = width * @in3d / @height
      else
        width = @width
        @cameraLeft.aspect = width / @height
      @renderer.setViewport 0, 0, width, @height
      @renderer.setScissor 0, 0, width, @height
      @renderer.enableScissorTest true
      @cameraLeft.updateProjectionMatrix()
      @renderer.render @scene, @cameraLeft
      if @in3d
        @renderer.setViewport width, 0, width, @height
        @renderer.setScissor width, 0, width, @height
        @renderer.enableScissorTest true
        @cameraRight.updateProjectionMatrix()
        @renderer.render @scene, @cameraRight

    runSimulation: ->
      if @smoothness >= 60
        @render()
      else
        setInterval @render, 1000 / @smoothness
      setInterval @animate, 50

