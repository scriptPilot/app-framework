/* Purpose: Manage ressource loading and application initialization */

// Use strict mode
'use strict'

// Load modules
import webFonts from 'webfontloader'
import Spinner from '../vendor/spin'
require('./init.css')

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
    } else if (/\.(jpg|jpeg|svg|png|gif|ico)$/.test(ressources[r])) {
      loadImage(ressources[r], updateProgress)
    } else {
      console.error('Unknown file type to load: ' + ressources[r])
      showErrorOverlay()
    }
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
  webFonts.load({
    custom: {
      urls: ['/' + css]
    },
    active: function () {
      callback(css, true)
    },
    inactive: function () {
      console.error('Failed to load file: ' + css)
      callback(css, false)
    },
    loading: () => { console.log('webfonts loading') },
    fontloading: () => { console.log('webfonts fontloading') },
    fontinactive: () => { console.log('webfonts fontinactive') },
    fontactive: () => { console.log('webfonts fontactive') }
  })
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
function showApplicationFrame (callback) {
  document.querySelector('#loadingOverlay').style.display = 'none'
  document.querySelector('#errorOverlay').style.display = 'none'
  document.querySelector('#frame').style.display = 'block'
  callback()
}

// Initialize application
loadInitialRessources(() => {
  loadSpinner(() => {
    showLoadingOverlay(() => {
      loadExtendedRessources(() => {
        showApplicationFrame(() => {
          window.initF7VueApp()
        })
      })
    })
  })
})
