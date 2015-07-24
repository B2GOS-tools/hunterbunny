
class Ghost
  constructor: ->
    shape = new THREE.CylinderGeometry(50, 60, 100)
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0.5, 0.5, 1
    @body = new THREE.Mesh(shape, cover)
    @body.castShadow = true
    shape = new THREE.SphereGeometry(50, 10, 10)
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0.5, 0.5, 1
    @head = new THREE.Mesh(shape, cover)
    @body.add @head
    @head.castShadow = true
    shape = new THREE.TorusGeometry(100, 15, 10, 25, 2.14)
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0.5, 0.5, 1
    @arms = new THREE.Mesh(shape, cover)
    @body.add @arms
    @arms.castShadow = true

  animate: (t) ->
    @head.position.set 0, 50 + 5 * Math.sin(10 * t), 0
    @arms.position.set 0, -50 - 5 * Math.sin(10 * t), 0
    @arms.rotation.set 0, 0, 0.5
    @body.position.set 100 * Math.sin(t), 90 * Math.cos(t), 200 * Math.sin(t)

class Critter
  constructor: ->
    @running = false
    @offset = 0
    @surface = new THREE.MeshPhongMaterial()
    @surface.emissive.setRGB 0.93, 0.8, 0.67
    @skin = Physijs.createMaterial(@surface, 0.9, 0.2)
    shape = new THREE.SphereGeometry(36, 36, 36)
    @body = new Physijs.BoxMesh(shape, @skin)
    @body.castShadow = true
    shape = new THREE.SphereGeometry(24, 20, 20)
    @head = new THREE.Mesh(shape, @skin)
    @head.castShadow = true
    @body.add @head
    @head.position.set 0, 20, 35
    @frontFeet = new THREE.Object3D()
    @body.add @frontFeet
    @frontFeet.position.set 0, -30, 20
    shape = new THREE.SphereGeometry(10, 15, 15)
    @foot1 = new THREE.Mesh(shape, @skin)
    @foot1.castShadow = true
    @frontFeet.add @foot1
    @foot1.position.set -15, 0, 0
    shape = new THREE.SphereGeometry(10, 15, 15)
    @foot2 = new THREE.Mesh(shape, @skin)
    @foot2.castShadow = true
    @frontFeet.add @foot2
    @foot2.position.set 15, 0, 0
    @backFeet = new THREE.Object3D()
    @body.add @backFeet
    @backFeet.position.set 0, -27, -20
    shape = new THREE.SphereGeometry(13, 15, 15)
    @foot3 = new THREE.Mesh(shape, @skin)
    @foot3.castShadow = true
    @backFeet.add @foot3
    @foot3.position.set -17, 0, 0
    shape = new THREE.SphereGeometry(13, 15, 15)
    @foot4 = new THREE.Mesh(shape, @skin)
    @foot4.castShadow = true
    @backFeet.add @foot4
    @foot4.position.set 17, 0, 0

  # start running
  run: (t, sidemotion) ->
    unless @running
      @offset = -t
      @running = true
      @sidemotion = sidemotion
      thrust = 0.1
      f1 = new THREE.Vector3()
      f2 = new THREE.Vector3()
      force = new THREE.Vector3()
      f1.getPositionFromMatrix @foot1.matrixWorld
      f2.getPositionFromMatrix @foot2.matrixWorld
      force = f1.sub f2
      force.multiplyScalar self.sidemotion * thrust
      #@body.applyImpulse force, f1 # makes the character hop out of the scene

  # animate is called in the slow (animate) loop
  animate: (t) ->
    stopped = 0.9 * Math.PI
    paced = 8 * (t + @offset - stopped)
    if @running
      if paced < 4 * Math.PI
        @gallop paced, stopped
      else
        @running = false
        @looking = true
    else if @looking
      if paced < 12 * Math.PI
        @head.rotation.y = Math.sin(paced / 4)
      else
        @head.rotation.y = 0
        @looking = false

  # gallop gets called from animate while the character is still running
  gallop: (paced, stopped) ->
    thrust = undefined
    if true
      thrust = 10 * Math.sin(paced + 0.66 + stopped)
      @body.applyCentralImpulse new THREE.Vector3(0, 4 * 1e6 * thrust, 1e6 * thrust)
      @body.rotation.x = 5 * Math.sin(paced)
    @backFeet.position.y = -25 + 10 * Math.sin(paced + 2.87 + stopped)
    @backFeet.position.z = -20 + 10 * Math.sin(paced + 2.87 + stopped)
    @frontFeet.position.y = -30 + 7 * Math.sin(paced + 0.66 + stopped)

class Bunny extends Critter
  constructor: ->
    super
    shape = new THREE.SphereGeometry(10, 10, 10)
    @tail = new THREE.Mesh(shape, @skin)
    @tail.castShadow = true
    @body.add @tail
    @tail.position.set 0, 0, -43
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0, 0, 0
    shape = new THREE.SphereGeometry(5, 5, 5)
    @eye1 = new THREE.Mesh(shape, cover)
    @head.add @eye1
    @eye1.position.set -10, 10, 20
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0, 0, 0
    shape = new THREE.SphereGeometry(5, 5, 5)
    @eye2 = new THREE.Mesh(shape, cover)
    @head.add @eye2
    @eye2.position.set 10, 10, 20
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0.8, 0.3, 0.3
    shape = new THREE.SphereGeometry(5, 5, 5)
    @eye1 = new THREE.Mesh(shape, cover)
    @head.add @eye1
    @eye1.position.set 0, 0, 25

    points = []
    pcount = 16
    i = 0
    while i < pcount
      points.push new THREE.Vector3(Math.sqrt(25 * (Math.sin(i * 0.2) + 0.2 * Math.sin(i * 0.4))), 0, 45 - 3 * i)
      i++
    shape = new THREE.LatheGeometry(points)
    @ear1 = new THREE.Mesh(shape, @skin)
    @ear1.castShadow = true
    @head.add @ear1
    @ear1.rotation.x = -Math.PI / 2
    @ear1.position.set 10, 20, 10
    @ear2 = new THREE.Mesh(shape, @skin)
    @ear2.castShadow = true
    @head.add @ear2
    @ear2.rotation.x = -Math.PI / 2
    @ear2.position.set -10, 20, 10

  gallop: (paced, stopped) ->
    super paced, stopped
    @ear1.rotation.y = 0.2 + 0.25 * Math.sin(paced + 2.04 + stopped)
    @ear2.rotation.y = -0.2 - 0.25 * Math.sin(paced + 2.04 + stopped)

class Frog extends Critter
  constructor: ->
    super
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0, 0, 0
    shape = new THREE.SphereGeometry(5, 5, 5)
    @eye1 = new THREE.Mesh(shape, cover)
    @head.add @eye1
    @eye1.position.set -15, 15, 10
    cover = new THREE.MeshPhongMaterial()
    cover.emissive.setRGB 0, 0, 0
    shape = new THREE.SphereGeometry(5, 5, 5)
    @eye2 = new THREE.Mesh(shape, cover)
    @head.add @eye2
    @eye2.position.set 15, 15, 10
    @surface.emissive.setRGB 0.5, 0.9, 0.25
