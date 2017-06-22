/* Purpose: Manage ressource loading and application initialization */

// Use strict mode
'use strict'

// Load modules
require('./init.css')
let Spinner = require('../vendor/spin')

// Add offline support for non-native applications
if (process.env.NODE_ENV === 'production') {
  let offlinePlugin = require('offline-plugin/runtime')
  if (!window.cordova) {
    offlinePlugin.install({
      onInstalled: function () {
        offlinePlugin.update()
      },
      onUpdateReady: function () {
        offlinePlugin.applyUpdate()
      },
      onUpdated: function () {
        window.location.reload()
      }
    })
  }
}

// Load graphics in development mode
if (process.env.NODE_ENV === 'development') {
  require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')
  require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/android-chrome-192x192.png')
}

// Define functions
function loadInitialRessources (callback) {
  if (document.readyState === 'complete') {
    callback()
  } else {
    window.addEventListener('load', () => {
      callback()
    })
  }
}
function loadSpinner (callback) {
  new Spinner({
    lines: 13,
    length: 5,
    width: 2,
    radius: 5,
    speed: 0.8,
    color: '#848484'
  }).spin(
    document.querySelector('#loadingOverlay .spinner')
  )
  callback()
}
function showLoadingOverlay (callback) {
  if (process.env.NODE_ENV === 'development') {
    document.querySelector('#loadingOverlay .progressBar').style.display = 'none'
  }
  document.querySelector('#loadingOverlay').style.display = 'block'
  callback()
}
function showErrorOverlay () {
  document.querySelector('#loadingOverlay').style.display = 'none'
  document.querySelector('#errorOverlay').style.display = 'block'
}
function loadExtendedRessources (callback) {
  // List ressources
  let ressources = ['app.js']
  // Function to monitor progress
  let ressourcesDone = []
  let updateProgress = (ressource, result) => {
    if (result === true) {
      if (ressourcesDone.indexOf(ressource) === -1) {
        ressourcesDone.push(ressource)
        let progress = Math.ceil(ressourcesDone.length / ressources.length * 100) + '%'
        document.querySelector('#loadingOverlay .progressBarInner').style.width = progress
      }
      if (ressourcesDone.length === ressources.length) {
        callback()
      }
    } else {
      showErrorOverlay()
    }
  }
  // Loop ressources (use copy to avoid conflicts with updateProgress)
  for (var r = 0; r < ressources.length; r++) {
    if (/\.js$/.test(ressources[r])) {
      loadScript(ressources[r], updateProgress)
    } else if (/\.css$/.test(ressources[r])) {
      loadCss(ressources[r], updateProgress)
    } else if (/\.(jpe?g|png|gif)$/.test(ressources[r])) {
      loadImage(ressources[r], updateProgress)
    } else {
      console.error('Unknown file type to load: ' + ressources[r])
      showErrorOverlay()
    }
  }
  // Add icon tags for preload
  if (process.env.FONT_FRAMEWORK7 === 'true') {
    let el = document.createElement('i')
    el.className = 'f7-icons'
    el.innerHTML = 'check'
    document.querySelector('#hiddenOverlay').append(el)
  }
  if (process.env.FONT_MATERIAL === 'true') {
    let el = document.createElement('i')
    el.className = 'material-icons'
    el.innerHTML = 'check'
    document.querySelector('#hiddenOverlay').append(el)
  }
  if (process.env.FONT_ION === 'true') {
    let el = document.createElement('i')
    el.className = 'icon ion-checkmark-round'
    document.querySelector('#hiddenOverlay').append(el)
  }
  if (process.env.FONT_AWESOME === 'true') {
    let el = document.createElement('i')
    el.className = 'fa fa-check'
    document.querySelector('#hiddenOverlay').append(el)
  }
}
function loadScript (script, callback) {
  var el = document.createElement('script')
  el.src = script
  el.onload = function () {
    callback(script, true)
  }
  el.onerror = function () {
    console.error('Failed to load file: ' + script)
    callback(script, false)
  }
  document.body.appendChild(el)
}
function loadCss (css, callback) {
  var el = document.createElement('link')
  el.rel = 'stylesheet'
  el.href = css
  el.onload = function () {
    callback(css, true)
  }
  el.onerror = function () {
    console.error('Failed to load file: ' + css)
    callback(css, false)
  }
  document.head.appendChild(el)
}
function loadImage (image, callback) {
  var el = document.createElement('img')
  el.src = image
  el.onload = function () {
    callback(image, true)
  }
  el.onerror = function () {
    console.error('Failed to load file: ' + image)
    callback(image, false)
  }
  document.querySelector('#hiddenOverlay').appendChild(el)
}

// Initialize application
loadInitialRessources(() => {
  loadSpinner(() => {
    showLoadingOverlay(() => {
      loadExtendedRessources(() => {
        window.initApplication()
        // Remove initialization overlays from DOM
        window.Dom7('#loadingOverlay').remove()
        window.Dom7('#errorOverlay').remove()
        window.Dom7('#hiddenOverlay').remove()
      })
    })
  })
})
