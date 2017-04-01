/*

  Purpose:
  - Manage theme integration in DEV mode
  - Load vendor scripts
    - Vue, Framework7, Framework7-Vue, iNoBounce
    - Firebase (if configured)
    - Icon languages (as configured)
  - Init Framework7-Vue application
    - Provide app configuration
    - Provide language patterns
    - Handle phone frame
    - Handle state restoration

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

// Define language
let language = /^([a-z]{2})$/.test(window.localStorage.language) === true ? window.localStorage.language : 'en'

// Define theme
let theme = window.localStorage.theme === 'material' ? 'material' : 'ios'

// Include Favicon
require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')

// Include vendor scripts
if (process.env.NODE_ENV === 'development') {
  require('../vendor/framework7/css/framework7.' + theme + '.min.css')
  require('../vendor/framework7/css/framework7.' + theme + '.colors.min.css')
}
//require('../vendor/framework7/js/framework7.min.js')
window._ = require('underscore')
window.firebase = require('firebase')
let Vue = require('vue')
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
  framework7: {
    root: '#app',
    routes: routes,
    material: theme === 'material'
  },
  data: function () {
    return {
      config: config,
      title: config.title, /* deprecated */
      theme: theme,
      language: language,
      user: null,
      version: projectVersion,
      frameworkVersion: frameworkVersion,
      packageVersion: frameworkVersion /* deprecated */
    }
  },
  watch: {
    theme: function (newTheme) {
      this.updateTheme()
      console.log('new theme is ' + newTheme)
      newTheme = newTheme === 'material' ? 'material' : 'ios'
      window.localStorage.theme = newTheme
      if (process.env.NODE_ENV === 'developmemt') {
        window.location.reload()
      }
    },
    language: function (newLanguage) {
      newLanguage = /^([a-z]{2})$/.test(newLanguage) === true ? newLanguage : 'en'
      window.localStorage.language = newLanguage
    }
  },
  methods: {
    onF7Init: function () {
      this.updateTheme()
      require('./manage-state')()
    },
    updateTheme: function () { /*
      if (process.env.NODE_ENV === 'production') {
        let hash = ''
        let styleScriptIncluded = false
        window.Dom7('script').each(function (i, el) {
          let src = window.Dom7(el).attr('src')
          let hashSearch = src.match(/^app\.(.+)\.js$/)
          if (hashSearch !== null) {
            hash = hashSearch[1]
          } else if (src.match(/^(ios|material)\.(.+)\.js$/) !== null) {
            if (styleScriptIncluded === false && src.match(/^(ios|material)\.(.+)\.js$/)[1] === this.theme) {
              styleScriptIncluded = true
            } else {
              window.Dom7(el).remove()
            }
          }
        }.bind(this))
        if (styleScriptIncluded === false) {
          let script = window.Dom7().add('script').attr('src', this.theme + '.' + hash + '.js')
          script.insertAfter('title')
        }
      } */
    }
  }
})
