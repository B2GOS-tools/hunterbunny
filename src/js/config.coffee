require.config
  shim:
    threeCore:
      exports: "THREE"

    three:
      exports: "THREE"

    threex:
      deps: ["three", "cannon", "cannonbody"]
      exports: "THREEx"

  paths:
    text: "../lib/text"
    shader: "../lib/shader"
    shaders: "../shaders"
    three: "../bower_components/threejs/build/three"
    threeCore: "../bower_components/threejs/build/three.min"
    threex: "../bower_components/threex.cannonjs/threex.cannonworld"
    cannonbody: "../bower_components/threex.cannonjs/threex.cannonbody"
    cannon: "../bower_components/threex.cannonjs/vendor/cannon.js/build/cannon"
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

