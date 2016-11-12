require.config
  shim:
    threeCore:
      exports: "THREE"

    three:
      exports: "THREE"

    threex:
      deps: ["three"]
      exports: "THREEx"

  paths:
    text: "../lib/text"
    shader: "../lib/shader"
    shaders: "../shaders"
    three: "../bower_components/threejs/build/three"
    threeCore: "../bower_components/threejs/build/three.min"
    threex: "../bower_components/threex.cannonjs"
    requirejs: "../bower_components/requirejs/require"
    bunnies: "../js/bunnies"

  waitSeconds: 30
  packages: []

require [
  "app"
  "container"
], (app, container) ->
  window.apphandle = app
  app.init()
  app.runSimulation()

