/*

  Purpose
  - Load and update ressources (data, functions, libraries)
  - Init App
  - Manage phone frame
  - Manage theme integration
  - Fix DOM
  - Restore state
  - Remember state
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
let rememberAndRestoreData = {
  created: function () {
    /*
    if (this.$options._componentTag === undefined && this.$parent && this.$parent.$options._componentTag === 'f7-pages' && this.$route) {
      let storageKey = 'data|' + this.$route.view.selector + '|' + this.$route.url.replace(/^(\/)(.+)(\/)$/, '$2')
      if (window.localStorage[storageKey] !== undefined) {
        try {
          let data = JSON.parse(window.localStorage[storageKey])
          for (let item in data) {
            this[item] = data[item]
          }
        } catch (err) {
          window.localStorage.removeItem(storageKey)
        }
      }
    }
    */
  },
  updated: function () {
    /*
    console.log(JSON.stringify(this.$route))
    if (this.$options._componentTag === undefined) {
      console.log(this)
    }
    if (this.$route !== undefined) {
      console.log('route', this)
    }
    if (this.$route !== undefined &&
        this.$options._componentTag === undefined &&
        this.$el._prevClass === 'page') {
      console.log(this)
    }
    if (this.$options._componentTag === undefined && this.$parent.$options._componentTag === 'f7-pages' && this.$route) {
      window.localStorage['data|' + this.$route.view.selector + '|' + this.$route.url.replace(/^(\/)(.+)(\/)$/, '$2')] = JSON.stringify(this.$data)
    }
    */
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
  Vue.mixin(rememberAndRestoreData)
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
    // Remove unneeded link elements
    window.Dom7('link').each(function (i, el) {
      let href = window.Dom7(el).attr('href').match(/^(ios|material)\.(.+)\.css$/)
      if (href !== null && href[1] !== app.theme) {
        window.Dom7(el).remove()
      }
    })
    // Remove unneeded script elements
    window.Dom7('script').each(function (i, el) {
      let src = window.Dom7(el).attr('src').match(/^(ios|material)\.(.+)\.js$/)
      if (src !== null && src[1] !== app.theme) {
        window.Dom7(el).remove()
      }
    })
  }
  // Add layout class to body (dark, white, default)
  if (app.layout !== 'default') {
    window.Dom7('body').addClass('layout-' + app.layout)
  }
  // Add color theme class to body
  if (app.color !== app.colors.default[app.theme]) {
    window.Dom7('body').addClass('theme-' + app.color)
  }
  // Callback
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
function restoreState (callback) {
  restoreScrollOnPageLoad()
  restoreTabOnPageLoad()
  restoreViews(function () {
    restoreSidepanel(function () {
      restorePopup(function () {
        restoreLoginScreen(function () {
          callback()
        })
      })
    })
  })
}
function restoreViews (callback, viewId) {
  viewId = viewId || 0
  if (viewId < window.f7.views.length) {
    restoreUrls(viewId, function () {
      restoreViews(callback, viewId + 1)
    })
  } else {
    callback()
  }
}
function restoreUrls (viewId, callback, urls, urlId) {
  urlId = urlId || 0
  urls = urls || []
  if (urlId === 0) {
    try {
      urls = JSON.parse(window.localStorage['urls|' + window.f7.views[viewId].selector])
      urls = Array.isArray(urls) ? urls : []
    } catch (err) {
      window.localStorage.removeItem('urls|' + window.f7.views[viewId].selector)
    }
  }
  if (urlId < urls.length) {
    setTimeout(function () {
      window.f7.views[viewId].router.load({url: urls[urlId], animatePages: false})
      restoreUrls(viewId, callback, urls, urlId + 1)
    }, 0)
  } else {
    callback()
  }
}
function restoreScrollOnPageLoad () {
  window.Dom7(document).on('page:init', function (e) {
    restoreScrollOnPage(e.target)
  })
  window.Dom7(document).on('panel:open popup:open', function (e) {
    window.Dom7(e.target).find('.page').each(function (i, pageEl) {
      restoreScrollOnPage(pageEl)
    })
  })
}
function restoreScrollOnPage (pageEl) {
  window.Dom7(pageEl).find('.page-content').each(function () {
    let storageKey = 'scroll|' + getViewSel(pageEl) + '|' + getViewUrl(pageEl) + (this.id !== '' ? '|' + this.id : '')
    if (/^[0-9]+$/.test(window.localStorage[storageKey])) {
      window.Dom7(this).scrollTop(window.localStorage[storageKey])
    }
  })
}
function restoreTabOnPageLoad () {
  window.Dom7(document).on('page:init', function (e) {
    let tab = window.localStorage['tab|' + getViewSel(e) + '|' + getViewUrl(e)]
    if (tab !== undefined) {
      window.f7.showTab('#' + tab, false)
    }
  })
}
function restoreSidepanel (callback) {
  if (window.localStorage.panel === 'left' || window.localStorage.panel === 'right') {
    setTimeout(function () {
      window.f7.openPanel(window.localStorage.panel, false)
      callback()
    }, 0)
  } else {
    callback()
  }
}
function restorePopup (callback) {
  if (window.localStorage.popupHtml) {
    setTimeout(function () {
      window.f7.popup(window.localStorage.popupHtml, true, false)
      callback()
    }, 0)
  } else if (window.localStorage.popupSel) {
    setTimeout(function () {
      window.f7.popup(window.localStorage.popupSel, false, false)
      callback()
    }, 0)
  } else {
    callback()
  }
}
function restoreLoginScreen (callback) {
  if (window.localStorage.loginScreen) {
    setTimeout(function () {
      window.f7.loginScreen(window.localStorage.loginScreen, false)
      callback()
    }, 0)
  } else {
    callback()
  }
}
function rememberState (callback) {
  setTimeout(function () {
    rememberViews()
    rememberScroll()
    rememberTab()
    rememberSidepanel()
    rememberPopup()
    rememberLoginScreen()
    callback()
  }, 0)
}
function rememberViews () {
  window.Dom7(document).on('page:init page:reinit', function (e) {
    if (e.detail.page.url) {
      let url = e.detail.page.url.match(/^(\/)?(.+?)(\/)?$/)[2]
      let urls = []
      let storageKey = 'urls|' + getViewSel(e)
      try {
        urls = JSON.parse(window.localStorage[storageKey])
        urls = Array.isArray(urls) ? urls : []
      } catch (err) {
        urls = []
      }
      if (e.type === 'page:init' && e.detail.page.url.substr(0, 9) !== '#content-') {
        urls.push(url)
      } else if (e.type === 'page:reinit' && e.detail.page.fromPage && e.detail.page.fromPage.url.substr(0, 9) !== '#content-' && urls.length > 0) {
        urls.pop()
      }
      if (urls.length > 0) {
        window.localStorage[storageKey] = JSON.stringify(urls)
      } else {
        window.localStorage.removeItem(storageKey)
      }
    }
  })
}
function rememberScroll () {
  window.Dom7('.page-content').on('scroll', function (e) {
    let storageKey = 'scroll|' + getViewSel(e) + '|' + getViewUrl(e) + (this.id !== '' ? '|' + this.id : '')
    window.localStorage[storageKey] = this.scrollTop
  })
  window.Dom7(document).on('page:init', function (e) {
    window.Dom7(e.target).find('.page-content').on('scroll', function (e) {
      let storageKey = 'scroll|' + getViewSel(e) + '|' + getViewUrl(e) + (this.id !== '' ? '|' + this.id : '')
      window.localStorage[storageKey] = this.scrollTop
    })
  })
}
function rememberTab () {
  window.Dom7(document).on('tab:show', function (e) {
    if (e.target.id !== '') {
      window.localStorage['tab|' + getViewSel(e) + '|' + getViewUrl(e)] = e.target.id
    }
  })
}
function rememberSidepanel () {
  window.Dom7(document).on('panel:open panel:close', function (e) {
    if (e.type === 'panel:open') {
      window.localStorage.panel = window.Dom7(e.target).hasClass('panel-left') ? 'left' : 'right'
    } else {
      window.localStorage.removeItem('panel')
    }
  })
}
function rememberPopup () {
  window.Dom7(document).on('popup:open popup:close', function (e) {
    if (e.type === 'popup:close') {
      window.localStorage.removeItem('popupSel')
      window.localStorage.removeItem('popupHtml')
    } else if (window.Dom7(e.target).hasClass('remove-on-close')) {
      window.localStorage.popupHtml = window.Dom7(e.target).prop('outerHTML')
    } else {
      let popupId = window.Dom7(e.target).attr('id')
      let popupClass = []
      for (let c = 0; c < e.target.classList.length; c++) {
        if (e.target.classList[c] !== 'popup' && e.target.classList[c] !== 'modal-in') {
          popupClass.push(e.target.classList[c])
        }
      }
      let popupSel = (popupId ? '#' + popupId : '') + (popupClass.length > 0 ? '.' + popupClass.join('.') : '')
      if (popupSel !== '') {
        window.localStorage.popupSel = popupSel
      }
    }
  })
}
function rememberLoginScreen () {
  window.Dom7(document).on('loginscreen:open loginscreen:close', function (e) {
    if (e.type === 'loginscreen:close') {
      window.localStorage.removeItem('loginScreen')
    } else {
      window.localStorage.loginScreen = '.' + e.target.className
    }
  })
}
function getViewSel (el) {
  el = window.Dom7(el.target || el).parents('.view')
  return (el.attr('id') !== '' && el.attr('id') !== null ? '#' + el.attr('id') : '') +
         (el[0].classList.length > 0 ? '.' + el[0].classList.value.replace(' ', '.') : '')
}
function getViewUrl (el) {
  let viewSel = getViewSel(el)
  for (let v = 0; v < window.f7.views.length; v++) {
    if (window.f7.views[v].selector === viewSel) {
      return window.f7.views[v].url.replace(/^(\/)(.+)(\/)$/, '$2')
    }
  }
}

// Run
checkWebpackInclusion(function () {
  loadRessources(function (data) {
    initApp(data, function (app) {
      managePhoneFrame(app, function () {
        manageThemeIntegration(app, function () {
          fixDom(app, function () {
            restoreState(function () {
              rememberState(function () {
                app.$$('#app').css('visibility', 'visible')
              })
            })
          })
        })
      })
    })
  })
})
