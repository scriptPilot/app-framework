/*

  Purpose
  - Load and update ressources (data, functions, libraries)
  - Init App
  - Manage phone frame
  - Manage theme integration
  - Fix DOM
  - Remember and restore state
  - Show App

*/

'use strict'

// Define mixins and functions
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
  let theme = window.localStorage.theme !== undefined && config.theme.split('-').indexOf(window.localStorage.theme) > -1 ? window.localStorage.theme : config.theme.split('-')[0]
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
let updateRessources = {
  watch: {
    language: function (newLanguage, oldLanguage) {
      let useLanguage = /^([a-z]{2})$/.test(newLanguage) ? newLanguage : oldLanguage
      if (useLanguage === newLanguage && window.localStorage.language !== newLanguage) {
        window.localStorage.language = newLanguage
      } else if (useLanguage !== newLanguage) {
        this.language = oldLanguage
        window.f7.alert('Language "' + newLanguage + '" is not valid. Please read our documentation on GitHub.', 'App Framework')
      }
    },
    theme: function (newTheme, oldTheme) {
      let useTheme = this.config.theme.split('-').indexOf(newTheme) > -1 ? newTheme : oldTheme
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
        window.localStorage.layout = newLayout
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
      let useColor = this.colors[this.theme][newColor] !== undefined ? newColor : oldColor
      if (useColor === newColor) {
        window.localStorage.color = newColor
        window.Dom7('body').removeClass('theme-' + oldColor)
        if (newColor !== this.colors.default[this.theme]) {
          window.Dom7('body').addClass('theme-' + newColor)
        }
      } else {
        this.color = oldColor
        window.f7.alert('Theme color "' + newColor + '" is not valid.', 'App Framework')
      }
    }
  }
}
function initApp (data, callback) {
  // Get routes
  let routes = require(process.env.APP_ROOT_FROM_SCRIPTS + 'routes.json')
  for (let r = 0; r < routes.length; r++) {
    routes[r].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].component)
    if (Array.isArray(routes[r].tabs)) {
      for (let t = 0; t < routes[r].tabs.length; t++) {
        routes[r].tabs[t].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].tabs[t].component)
      }
    }
  }
  // Init Framework7-Vue app
  let Vue = require('vue')
  Vue.use(require('../vendor/framework7-vue/framework7-vue.min.js'))
  let appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  new Vue({ // eslint-disable-line
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    mixins: [updateRessources],
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
  callback()
}
function manageThemeIntegration (app, callback) {
  if (process.env.NODE_ENV === 'production' && (app.config.theme === 'ios-material' || app.config.theme === 'material-ios')) {
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
  if (app.layout !== 'default') {
    window.Dom7('body').addClass('layout-' + app.layout)
  }
  if (app.color !== app.colors.default[app.theme]) {
    window.Dom7('body').addClass('theme-' + app.color)
  }
  callback()
}
function fixDom (app, callback) {
  app.$$(document).on('page:beforeinit', function (e) {
    if (!/^#content-/.test(e.detail.page.url)) {
      // tbc
    }
  })
  callback()
}
function restoreState (app, callback) {
  restoreTabs()
  restoreView(app, callback)
}
function restoreTabs () {
  window.Dom7(document).on('page:init', function (e) {
    let storeKey = 'tab|' + getViewSel(e.target) + '|' + getViewUrl(e.target)
    if (window.localStorage[storeKey]) {
      window.f7.showTab('#' + window.localStorage[storeKey], false)
    }
  })
}
function restoreView (app, callback, viewId) {
  viewId = viewId || 0
  if (viewId < app.$f7.views.length) {
    restoreUrls(app, viewId, function () {
      restoreView(app, callback, viewId + 1)
    })
  } else {
    callback()
  }
}
function restoreUrls (app, viewId, callback, urlId) {
  try {
    urlId = urlId || 0
    let storageKey = 'urls|' + app.$f7.views[viewId].selector
    let urls = window.localStorage[storageKey] ? JSON.parse(window.localStorage[storageKey]) : []
    if (urlId < urls.length) {
      setTimeout(function () {
        app.$f7.views[viewId].router.load({url: urls[urlId], animatePages: false})
        restoreUrls(app, viewId, callback, urlId + 1)
      }, 0)
    } else {
      callback()
    }
  } catch (err) {
    callback()
  }
}
function rememberState (app, callback) {
  setTimeout(function () {
    rememberUrls()
    rememberTabs()
    callback()
  }, 0)
}
function rememberUrls () {
  window.Dom7(document).on('page:init page:reinit', function (e) {
    // Get URL without beginning/ending slash
    let url = e.detail.page.url.match(/^(\/)?(.+?)(\/)?$/)[2]
    // Get view selector
    let viewSel = getViewSel(e.target)
    // Get current URLs from local storage or start new array
    let urls = window.localStorage['urls|' + viewSel] !== undefined ? JSON.parse(window.localStorage['urls|' + viewSel]) : []
    if (!Array.isArray(urls)) {
      urls = []
    }
    // Add new page to array
    if (e.type === 'page:init' && e.detail.page.url.substr(0, 9) !== '#content-') {
      urls.push(url)
    // Remove page from array
    } else if (e.type === 'page:reinit' && e.detail.page.fromPage && e.detail.page.fromPage.url.substr(0, 9) !== '#content-' && urls.length > 0) {
      urls.pop()
    }
    // Update local storage
    if (JSON.stringify(urls) !== '[]') {
      window.localStorage['urls|' + viewSel] = JSON.stringify(urls)
    // Remove local storage
    } else {
      delete window.localStorage['urls|' + viewSel]
    }
  })
}
function rememberTabs ()  {
  window.Dom7(document).on('tab:show', function (e) {
    let tabId = e.target.id
    let viewSel = getViewSel(e.target)
    let viewUrl = getViewUrl(e.target)
    let storageKey = 'tab|' + viewSel + '|' + viewUrl
    window.localStorage[storageKey] = tabId
  })
}
function getViewSel (el) {
  let viewEl = window.Dom7(el).parents('.view')
  let viewSel = (viewEl.attr('id') !== '' && viewEl.attr('id') !== null ? '#' + viewEl.attr('id') + ' ' : '') +
                (viewEl[0].classList.length > 0 ? '.' + viewEl[0].classList.value.replace(' ', '.') : '')
  return viewSel
}
function getViewUrl (el) {
  let viewSel = getViewSel(el)
  let viewUrl = ''
  for (let v = 0; v < window.f7.views.length; v++) {
    if (window.f7.views[v].selector === viewSel) {
      viewUrl = window.f7.views[v].url
    }
  }
  viewUrl = viewUrl.replace(/^(\/)(.+)(\/)$/, '$2')
  return viewUrl
}

// Run
checkWebpackInclusion(function () {
  loadRessources(function (data) {
    initApp(data, function (app) {
      managePhoneFrame(app, function () {
        manageThemeIntegration(app, function () {
          fixDom(app, function () {
            restoreState(app, function () {
              rememberState(app, function () {
                app.$$('#app').css('visibility', 'visible')
              })
            })
          })
        })
      })
    })
  })
})
