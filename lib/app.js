/*

  Purpose
  - Load ressources (data, functions, libraries)
  - Init App
  - Manage phone frame
  - Manage theme integration
  - Manage Dom fix
  - Manage state restoration

*/

'use strict'

// Define functions
function checkWebpackInclusion (callback) {
  if (process.env.APP_ROOT_FROM_SCRIPTS === undefined) {
    process.stdout.write('\x1bc' + 'Error: This file must be run by Webpack.\n\n')
    process.exit()
  } else {
    callback()
  }
}
function loadRessources (callback) {
  // Environment
  let config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  let language = /^([a-z]{2})$/.test(window.localStorage.language) === true ? window.localStorage.language : config.defaultLanguage
  let theme = window.localStorage.theme !== undefined && config.theme.indexOf(window.localStorage.theme) > -1 ? window.localStorage.theme : config.theme.split('-')[0]
  let layout = window.localStorage.layout === 'dark' || (window.localStorage.layout === 'white' && theme === 'ios') ? window.localStorage.layout : 'default'
  let colors = require('./theme-colors.json')
  let color = window.localStorage.color !== undefined && colors[theme][window.localStorage.color] !== undefined ? window.localStorage.color : colors.default[theme]
  let user = window.localStorage.user !== undefined ? JSON.parse(window.localStorage.user) : null
  let projectVersion = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'package.json').version
  let frameworkVersion = require('../package.json').version
  // Theme (in development mode)
  if (process.env.NODE_ENV === 'development') {
    if (theme === 'material') {
      require('./material')
    } else {
      require('./ios')
    }
  }
  // Framework7
  require('../vendor/framework7/js/framework7.min.js')
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
  require('../lib/app.css')
  // Favicon
  require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')
  // Callback with data object
  callback({
    config: config,
    language: language,
    theme: theme,
    layout: layout,
    colors: colors,
    color: color,
    user: user,
    projectVersion: projectVersion,
    frameworkVersion: frameworkVersion
  })
}
function initApp (data, callback) {
  let Vue = require('vue')
  Vue.use(require('../vendor/framework7-vue/framework7-vue.min.js'))
  let appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  let routes = require(process.env.APP_ROOT_FROM_SCRIPTS + 'routes.json')
  for (let r = 0; r < routes.length; r++) {
    routes[r].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].component)
    if (Array.isArray(routes[r].tabs)) {
      for (let t = 0; t < routes[r].tabs.length; t++) {
        routes[r].tabs[t].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].tabs[t].component)
      }
    }
  }
  new Vue({ // eslint-disable-line
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    framework7: {
      root: '#app',
      routes: routes,
      material: data.theme === 'material'
    },
    data: function () {
      return data
    },
    methods: {
      onF7Init: function () {
        callback(this)
      }
    }
  })
}
function managePhoneFrame (app, callback) {
  console.log('manage phone frame')
  callback()
}
function manageThemeIntegration (app, callback) {
  console.log('manage theme integration')
  callback()
}
function manageDomFix (app, callback) {
  console.log('manage dom fix')
  callback()
}
function manageStateRestoration (app, callback) {
  console.log('manage state restoration')
  callback()
}

// Run
checkWebpackInclusion(function () {
  loadRessources(function (data) {
    initApp(data, function (app) {
      managePhoneFrame(app, function () {
        manageThemeIntegration(app, function () {
          manageDomFix(app, function () {
            manageStateRestoration(app, function () {
              console.log('done')
            })
          })
        })
      })
    })
  })
})


/*
  // Update data
  watch: {
    language: function (newLanguage) {
      newLanguage = /^([a-z]{2})$/.test(newLanguage) === true ? newLanguage : config.defaultLanguage
      window.localStorage.language = newLanguage
    },
    theme: function (newTheme, oldTheme) {
      let useTheme = config.theme.indexOf(newTheme) > -1 ? newTheme : this.theme
      if (useTheme === newTheme && window.localStorage.theme !== newTheme) {
        window.localStorage.theme = newTheme
        window.location.reload()
      } else if (useTheme !== newTheme) {
        this.theme = oldTheme
        window.f7.alert('Theme "' + newTheme + '" is not configured. Please read our documentation on GitHub.', 'App Framework')
      }
    },
    layout: function (newLayout, oldLayout) {
      let useLayout = newLayout === 'dark' || (newLayout === 'white' && this.theme === 'ios') ? newLayout : 'default'
      if (useLayout === newLayout) {
        window.localStorage.layout = useLayout
        window.Dom7('body').removeClass('layout-' + oldLayout)
        if (newLayout !== 'default') {
          window.Dom7('body').addClass('layout-' + newLayout)
        }
      } else {
        this.layout = oldLayout
        window.f7.alert('Theme layout "' + newLayout + '" is not valid.', 'App Framework')
      }
    },
    color: function (newColor, oldColor) {
      let useColor = this.colors[this.theme][newColor] !== undefined ? newColor : this.color
      if (useColor === newColor) {
        window.localStorage.color = newColor
        window.Dom7('body').removeClass('theme-' + oldColor).addClass('theme-' + newColor)
      } else {
        this.color = oldColor
        window.f7.alert('Theme color "' + newColor + '" is not valid.', 'App Framework')
      }
    }
  },
  methods: {
    manageThemeIntegration: function () {
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
      if (this.layout !== 'default') {
        window.Dom7('body').addClass('layout-' + this.layout)
      }
      window.Dom7('body').addClass('theme-' + this.color)
    },
    manageDomFix: function () {
      this.$$(document).on('page:beforeinit', function (e) {
        if (!/^#content-/.test(e.detail.page.url)) {
          // todo
        }
      })
    },
    manageStateRestoration: function () {

    }
  }
})*/
