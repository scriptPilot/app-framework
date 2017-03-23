/*

  Purpose: Webpack entry point
  - Load client resources
    - Configuration
    - Favicon
    - Vendor scripts
      - Underscore
      - Firebase
      - Vue
      - Framework7
      - Framework7-Vue
      - iNoBounce
    - Icon fonts
    - Main css file
  - Load pages and tabs according routes.json
  - Init Vue/Framework7 app
    - Provide data
      - config
      - current theme
      - current language
      - current user
      - project version
      - framework version
    - Remember and restore the application state

*/

'use strict'

// Check inclusion by Webpack
if (process.env.APP_ROOT_FROM_SCRIPTS === undefined) {
  process.stdout.write('\x1bc' + 'Error: This file must be run with webpack.\n\n')
  process.exit()
}

// Include configuration, project and framework version
let config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
let projectVersion = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'package.json').version
let frameworkVersion = require('../package.json').version

// Include Favicon
require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')

// Include vendor scripts
window._ = require('underscore')
window.firebase = require('firebase')
let Vue = require('vue')
require('../vendor/framework7/js/framework7.min.js')
require('../vendor/framework7/css/framework7.' + process.env.THEME + '.min.css')
require('../vendor/framework7/css/framework7.' + process.env.THEME + '.colors.min.css')
Vue.use(require('../vendor/framework7-vue/framework7-vue.min.js'))
require('inobounce')

// Include icon fonts
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

// Include main css file
require('../main.css')

// Load routes
let routes = require(process.env.APP_ROOT_FROM_SCRIPTS + 'routes.json')
for (let r = 0; r < routes.length; r++) {
  routes[r].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].component)
  if (Array.isArray(routes[r].tabs)) {
    for (let t = 0; t < routes[r].tabs.length; t++) {
      routes[r].tabs[t].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].tabs[t].component)
    }
  }
}

// Init Vue/Framework7 app
new Vue({ // eslint-disable-line
  el: '#app',
  template: '<app />',
  components: {
    app: require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  },
  mixins: [
    require('./state-mixin.js')
  ],
  framework7: {
    root: '#app',
    routes: routes,
    material: process.env.THEME === 'material'
  },
  data: function () {
    return {
      config: config,
      title: config.title, /* deprecated */
      theme: window.localStorage.theme === 'material' ? 'material' : 'ios',
      language: /^([a-z]{2})$/.test(window.localStorage.language) === true ? window.localStorage.language : 'en',
      user: null,
      version: projectVersion,
      frameworkVersion: frameworkVersion,
      packageVersion: frameworkVersion /* deprecated */
    }
  },
  watch: {
    theme: function (newTheme) {
      newTheme = newTheme === 'material' ? 'material' : 'ios'
      window.localStorage.theme = newTheme
    },
    language: function (newLanguage) {
      newLanguage = /^([a-z]{2})$/.test(newLanguage) === true ? newLanguage : 'en'
      window.localStorage.language = newLanguage
    }
  }
})
