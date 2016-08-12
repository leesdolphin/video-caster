/* global requirejs: false */

requirejs.config({
})

requirejs(['index'], function (index) {
  'use strict'
  function loaded () {
    window.requestAnimationFrame(function () {
      const render = index.entrypoint(document.getElementById('container'))
      window.requestAnimationFrame(render)
    })
  }
  switch (document.readyState) {
    case 'complete':
    case 'interactive':
      loaded()
      break
    default:
      document.addEventListener('DOMContentLoaded', loaded)
  }
})
