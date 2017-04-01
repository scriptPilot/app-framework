/* Purpose: Provide app client code */

'use strict'

// Define variables
let config, language, theme, projectVersion, frameworkVersion
let Vue, appComponent, routes

// Define functions
function checkInclusionByWebpack (callback) {
  if (process.env.APP_ROOT_FROM_SCRIPTS !== undefined) {
    callback()
  } else {
    process.stdout.write('\x1bc' + 'Error: This file must be run by Webpack.\n\n')
    process.exit()
  }
}
function loadEnvironment (callback) {
  config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  language = /^([a-z]{2})$/.test(window.localStorage.language) === true ? window.localStorage.language : config.defaultLanguage
  theme = window.localStorage.theme !== undefined && config.theme.indexOf(window.localStorage.theme) > -1 ? window.localStorage.theme : config.theme.split('-')[0]
  projectVersion = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'package.json').version
  frameworkVersion = require('../package.json').version
  callback()
}
function loadRessources (callback) {
  // Theme
  if (process.env.NODE_ENV === 'development') {
    if (theme === 'material') {
      require('./material')
    } else {
      require('./ios')
    }
  }
  // Framework7
  require('../vendor/framework7/js/framework7.min.js')
  // Vue
  Vue = require('vue')
  // Framework7-Vue
  Vue.use(require('../vendor/framework7-vue/framework7-vue.min.js'))
  // iNoBounce
  require('inobounce')
  // Icon fonts
  if (process.env.FONT_FRAMEWORK7 === 'true') {
    require('framework7-icons/css/framework7-icons.css')
  }
  if (process.env.FONT_MATERIAL === 'true') {
    require('../vendor/material-icons/css/material-icons.css')
  }
  if (process.env.FONT_ION === 'true') {
    require('ionicons/dist/css/ionicons.min.css')
  }
  if (process.env.FONT_AWESOME === 'true') {
    require('font-awesome/css/font-awesome.min.css')
  }
  // Firebase
  if (config.firebase.useDatabaseService === true ||
        config.firebase.useStorageService === true ||
        config.firebase.useEmailLogin === true ||
        config.firebase.useEmailRegistration === true) {
    require('firebase')
  }
  // App.css file
  require('../app.css')
  // Favicon
  require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')
  // App component
  appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  // routes
  routes = require(process.env.APP_ROOT_FROM_SCRIPTS + 'routes.json')
  for (let r = 0; r < routes.length; r++) {
    routes[r].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].component)
    if (Array.isArray(routes[r].tabs)) {
      for (let t = 0; t < routes[r].tabs.length; t++) {
        routes[r].tabs[t].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].tabs[t].component)
      }
    }
  }
  // Callback
  callback()
}
function initApp () {
  new Vue({ // eslint-disable-line
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    framework7: {
      root: '#app',
      routes: routes,
      material: theme === 'material'
    },
    data: function () {
      return {
        config: config,
        language: language,
        theme: theme,
        user: null,
        version: projectVersion,
        frameworkVersion: frameworkVersion
      }
    },
    watch: {
      language: function (newLanguage) {
        newLanguage = /^([a-z]{2})$/.test(newLanguage) === true ? newLanguage : config.defaultLanguage
        window.localStorage.language = newLanguage
      },
      theme: function (newTheme) {
        let useTheme = config.theme.indexOf(newTheme) > -1 ? newTheme : config.theme.split('-')[0]
        if (useTheme === newTheme && window.localStorage.theme !== useTheme) {
          window.localStorage.theme = useTheme
          window.location.reload()
        } else if (useTheme !== newTheme) {
          this.theme = useTheme
          window.f7.alert('Theme "' + newTheme + '" is not configured. Please read our documentation on GitHub.', 'App Framework')
        }
      }
    },
    methods: {
      onF7Init: function () {
        if (process.env.NODE_ENV === 'production' && (config.theme === 'ios-material' || config.theme === 'material-ios')) {
          window.Dom7('link').each(function (i, el) {
            let href = window.Dom7(el).attr('href').match(/^(ios|material)\.(.+)\.css$/)
            if (href !== null && href[1] !== theme) {
              window.Dom7(el).remove()
            }
          })
          window.Dom7('script').each(function (i, el) {
            let src = window.Dom7(el).attr('src').match(/^(ios|material)\.(.+)\.js$/)
            if (src !== null && src[1] !== theme) {
              window.Dom7(el).remove()
            }
          })
        }
      }
    }
  })
}

// Run
checkInclusionByWebpack(function () {
  loadEnvironment(function () {
    loadRessources(function () {
      initApp()
    })
  })
})
