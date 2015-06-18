require.config
  shim:
    threeCore:
      exports: "THREE"

    three:
      exports: "THREE"

    physi:
      deps: ["three"]
      exports: "Physijs"

  paths:
    text: "../lib/text"
    shader: "../lib/shader"
    shaders: "../shaders"
    ammo: "../bower_components/ammo.js/builds/ammo"
    three: "../bower_components/threejs/build/three"
    threeCore: "../bower_components/threejs/build/three.min"
    physi: "../bower_components/physijs/physi"
    physijs_worker: "../bower_components/physijs/physijs_worker"
    requirejs: "../bower_components/requirejs/require"
    bunnies: "../js/bunnies"

  waitSeconds: 30
  packages: []

require [
  "app"
  "container"
], (app, container) ->
  app.init()
  app.runSimulation()

