/* Purpose: Provide client code */

'use strict'

// Preparation
let globalDataObjectMixin = {
  beforeCreate: function () {
    if (process.env.USE_GLOBAL_DATA_OBJECT === 'true') require('lodash')
  },
  computed: {
    data: function () {
      return this.$root.globalDataObject
    }
  },
  methods: {
    saveData: function (path, value) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.globalDataObject))
      // Add value to path
      data = window._.set(data, path, value)
      // Update root data object
      this.$root.$set(this.$root, 'globalDataObject', data)
      // Update local storage
      window.localStorage.globalDataObject = JSON.stringify(this.$root.globalDataObject)
    },
    removeData: function (path) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.globalDataObject))
      // Remove path
      window._.unset(data, path)
      // Update root data object
      this.$root.$set(this.$root, 'globalDataObject', data)
      // Update local storage
      window.localStorage.globalDataObject = JSON.stringify(this.$root.globalDataObject)
    }
  }
}
function resetLocalStorage (callback) {
  callback()
}
function loadIconFonts (callback) {
  if (process.env.FONT_FRAMEWORK7 === 'true') require('framework7-icons/css/framework7-icons.css')
  if (process.env.FONT_MATERIAL === 'true') require('../vendor/material-icons/css/material-icons.css')
  if (process.env.FONT_ION === 'true') require('ionicons/dist/css/ionicons.css')
  if (process.env.FONT_AWESOME === 'true') require('font-awesome/css/font-awesome.css')
  callback()
}
function getRoutes () {
  // Get routes from routes.json file
  let routes = require(process.env.APP_ROOT_FROM_SCRIPTS + 'routes.json')
  for (let r = 0; r < routes.length; r++) {
    // Page routes
    routes[r].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].component)
    // Tab routes
    if (Array.isArray(routes[r].tabs)) {
      for (let t = 0; t < routes[r].tabs.length; t++) {
        routes[r].tabs[t].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].tabs[t].component)
      }
    }
  }
  // Add login screen route
  routes.push({
    path: '/app-framework-login-screen/',
    component: require('./login-screen.vue')
  })
  // Return routes
  return routes
}

// Initialization
function initF7Vue (callback) {
  // Load App Framework package information
  let framework = require('../package.json')
  // Load project package information
  let project = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'package.json')
  // Load application configuration
  let config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  // Load Vue
  let vue = require('vue/dist/vue.common.js')
  // Load Framework7
  require('../vendor/framework7/js/framework7.js')
  // Load Framework7-Vue plugin
  let theme = /^(ios|material)$/.test(window.localStorage.theme) ? window.localStorage.theme : config.theme.split('-')[0]
  vue.use(require('../vendor/framework7-vue/framework7-vue.js'), {theme: theme})
  // Load app.vue component
  let appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  // Load favicon
  require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')
  // Define initial data
  let initialData = {
    framework: framework,
    project: project,
    config: config,
    language: config.language,
    theme: theme,
    color: config.color,
    layout: config.layout,
    statusbarVisibility: config.statusbarVisibility,
    statusbarTextColor: config.statusbarTextColor,
    statusbarBackgroundColor: config.statusbarBackgroundColor,
    test: 'default'
  }
  // Use global data object
  if (config.useGlobalDataObject === true) {
    initialData.globalDataObject = window.localStorage.globalDataObject !== undefined ? JSON.parse(window.localStorage.globalDataObject) : {}
    vue.mixin(globalDataObjectMixin)
  }
  // Init Framework7-Vue application
  window.app = new vue({ // eslint-disable-line
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    data: initialData,
    mixins: [{
      created: function () {
        console.log('mixin created')
        /*
        console.log('#app', window.Dom7('#app').length)
        console.log('.views', window.Dom7('.views').length)
        console.log('.list-block', window.Dom7('.list-block').length)
        */
      }
    }],
    created: function () {
      console.log('Main created')
    },
    mounted: function () {
      console.log('main mounted')
    },
    framework7: {
      root: '#app',
      routes: getRoutes(),
      modalTitle: config.title
    },
    methods: {
      onF7Init: function () {
        console.log('main f7 init')
        callback(this)
      }
    },
    watch: {
      language: updateLanguage,
      theme: updateTheme,
      color: updateColor,
      layout: updateLayout,
      statusbarVisibility: updateStatusbarVisibility,
      statusbarTextColor: updateStatusbarTextColor,
      statusbarBackgroundColor: updateStatusbarBackgroundColor
    }
  })
}
function initTheme (app, callback) {
  if (process.env.NODE_ENV === 'development') {
    if (app.theme === 'material') require('./material')
    else require('./ios')
  } else if (app.config.theme === 'ios-material' || app.config.theme === 'material-ios') {
    window.Dom7('link').each(function (i, el) {
      let href = window.Dom7(el).attr('href').match(/^(ios|material)\.(.+)\.css$/)
      if (href !== null && href[1] !== app.theme) {
        window.Dom7(el).remove()
      }
    })
    window.Dom7('script').each(function (i, el) {
      let src = window.Dom7(el).attr('src').match(/^(ios|material)\.(.+)\.js$/)
      if (src !== null && src[1] !== app.theme) {
        window.Dom7(el).remove()
      }
    })
  }
  callback()
}
function initFirebase (callback) {
  callback()
}
function defineAppMode (callback) {
  callback()
}
function addMissingStatusbar (callback) {
  callback()
}
function transformSubnavbarForMaterial (callback) {
  callback()
}
function initFixes (callback) {
  callback()
}
function manageState (callback) {
  callback()
}
function resetLocalStorageAlert (callback) {
  callback()
}
function checkForUpdates (callback) {
  callback()
}

// Updates
function updateLanguage (newLanguage, oldLanguage) {}
function updateTheme (newTheme, oldTheme) {
  if (newTheme === 'ios' || newTheme === 'material') {
    window.localStorage.theme = newTheme
    if (newTheme !== oldTheme) {
      window.location.reload()
    }
  } else {
    window.app.theme = oldTheme
  }
}
function updateColor (newColor, oldColor) {}
function updateLayout (newLayout, oldLayout) {}
function updateStatusbarVisibility (newState, oldState) {}
function updateStatusbarTextColor (newColor, oldColor) {}
function updateStatusbarBackgroundColor (newColor, oldColor) {}

// Run
resetLocalStorage(function () {
  loadIconFonts(function () {
    initF7Vue(function (app) {
      initTheme(app, function () {
        initFirebase(function () {
          defineAppMode(function () {
            addMissingStatusbar(function () {
              transformSubnavbarForMaterial(function () {
                initFixes(function () {
                  manageState(function () {
                    resetLocalStorageAlert(function () {
                      checkForUpdates(function () {
                        // Initialization done
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
