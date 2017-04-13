/*

  Purpose
  - Load and update ressources (data, functions, libraries)
  - Init App
  - Manage phone frame
  - Manage theme integration
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
  let data = window.localStorage.data ? JSON.parse(window.localStorage.data) : {}
  let config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  let language = /^([a-z]{2})$/.test(window.localStorage.language) === true ? window.localStorage.language : config.defaultLanguage
  let theme = window.localStorage.theme !== undefined && config.theme.split('-').indexOf(window.localStorage.theme) > -1 ? window.localStorage.theme : config.theme.split('-')[0]
  let layout = window.localStorage.layout === 'dark' || (window.localStorage.layout === 'white' && theme === 'ios') ? window.localStorage.layout : 'default'
  let colors = require('./theme-colors.json')
  let color = window.localStorage.color !== undefined && colors[theme][window.localStorage.color] !== undefined ? window.localStorage.color : colors.default[theme]
  let statusbarBackgroundColor = window.localStorage.statusbarBackgroundColor !== undefined && /^#([0-9a-f]{6})$/i.test(window.localStorage.statusbarBackgroundColor) ? window.localStorage.statusbarBackgroundColor : config.statusbarBackgroundColor
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
  // Lodash
  require('lodash')
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
    data: data,
    config: config,
    language: language,
    theme: theme,
    layout: layout,
    colors: colors,
    color: color,
    statusbarBackgroundColor: statusbarBackgroundColor,
    user: user,
    projectVersion: projectVersion,
    frameworkVersion: frameworkVersion
  })
}
let globalDataObject = {
  computed: {
    data: function () {
      return this.$root.data
    }
  },
  methods: {
    saveData: function (path, value) {
      let data = JSON.parse(JSON.stringify(this.$root.data))
      data = window._.set(data, path, value)
      this.$root.$set(this.$root, 'data', data)
      window.localStorage.data = JSON.stringify(this.$root.data)
    },
    removeData: function (path) {
      let data = JSON.parse(JSON.stringify(this.$root.data))
      window._.unset(data, path)
      this.$root.$set(this.$root, 'data', data)
      window.localStorage.data = JSON.stringify(this.$root.data)
    }
  }
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
        // if (newColor !== this.colors.default[this.theme]) {
        window.Dom7('body').addClass('theme-' + newColor)
        // }
      } else {
        this.color = oldColor
        window.f7.alert('Theme color "' + newColor + '" is not valid.', 'App Framework')
      }
    },
    statusbarBackgroundColor: function (newColor, oldColor) {
      let useColor = /^#([0-9a-f]{6})$/i.test(newColor) ? newColor : oldColor
      if (useColor === newColor) {
        window.Dom7('.statusbar-overlay').css('background-color', newColor)
        if (window.StatusBar) {
          window.StatusBar.backgroundColorByHexString(newColor)
        }
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
  Vue.mixin(globalDataObject, rememberAndRestoreData)
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
  // Statusbar background color
  window.Dom7('.statusbar-overlay').css('background-color', app.statusbarBackgroundColor)
  if (window.StatusBar) {
    window.StatusBar.backgroundColorByHexString(app.statusbarBackgroundColor)
  }
  // Callback
  callback()
}

function restoreState (callback) {
  restoreScrollOnPageLoad()
  restoreTabOnPageLoad()
  restoreFormInputOnPageLoad()
  restoreViews(function () {
    restoreOverlays(function () {
      callback()
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
function restoreFormInputOnPageLoad () {
  window.Dom7(document).on('page:init', function (e) {
    window.Dom7(e.target).find('form').each(function (i, el) {
      let formId = window.Dom7(el).attr('id')
      let formData = window.localStorage['formInput|' + formId] ? JSON.parse(window.localStorage['formInput|' + formId]) : null
      if (formId !== null && typeof formData === 'object' && formData !== null) {
        window.f7.formFromData('#' + formId, formData)
      }
    })
  })
}
function restoreOverlays (callback, elements) {
  elements = elements || ['popup', 'loginscreen', 'picker', 'panel', 'actions']
  if (elements.length === 0) {
    callback()
  } else {
    let element = elements.shift()
    let value = window.localStorage[element]
    if (value !== undefined) {
      setTimeout(function () {
        if (element === 'panel') {
          window.f7.openPanel(value === 'right' ? 'right' : 'left', false)
        } else if (element === 'actions') {
          window.f7.openModal(value, false)
        } else if (element === 'loginscreen') {
          window.f7.loginScreen(value, false)
        } else if (element === 'picker') {
          window.f7.pickerModal(value, false, false)
        } else if (element === 'popup') {
          window.f7.popup(value, false, false)
        }
        restoreOverlays(callback, elements)
      }, 0)
    } else {
      restoreOverlays(callback, elements)
    }
  }
}
function restoreFocus () {
  if (window.localStorage.focus) {
    setTimeout(function () {
      window.Dom7(window.localStorage.focus).focus()
    }, 0)
  }
}

function rememberState (callback) {
  setTimeout(function () {
    rememberViews()
    rememberScroll()
    rememberTab()
    rememberOverlays()
    rememberFormData()
    rememberFocus()
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
function rememberOverlays () {
  window.Dom7(document).on('panel:open panel:close actions:open actions:close loginscreen:open loginscreen:close picker:open picker:close popup:open popup:close', function (e) {
    // Get details
    let type = e.type.split(':')[0]
    let action = e.type.split(':')[1]
    let id = e.target.id
    let classes = e.target.className.split(' ')
    // Update local storage
    if (action === 'close') {
      window.localStorage.removeItem(type)
    } else if (type === 'panel') {
      window.localStorage.panel = classes.indexOf('panel-left') !== -1 ? 'left' : 'right'
    } else if (['popup', 'loginscreen', 'picker', 'actions'].indexOf(type) !== -1 && id !== '') {
      window.localStorage[type] = '#' + id
    }
  })
}
function rememberFormData () {
  window.Dom7(document).on('keyup change', function (e) {
    let formId = window.Dom7(e.target).parents('form').attr('id')
    if (formId !== null) {
      window.localStorage['formInput|' + formId] = JSON.stringify(window.f7.formToData('#' + formId))
    }
  })
}
function rememberFocus () {
  window.Dom7(document).on('focusin focusout', function (e) {
    if (e.type === 'focusout') {
      window.localStorage.removeItem('focus')
    } else {
      let formId = window.Dom7(e.target).parents('form').attr('id')
      let inputName = window.Dom7(e.target).attr('name')
      if (formId !== null && inputName !== null) {
        let focusEl = 'form#' + formId + ' [name=' + inputName + ']'
        window.localStorage.focus = focusEl
      } else {
        window.localStorage.removeItem('focus')
      }
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
          restoreState(function () {
            rememberState(function () {
              app.$$('#app').css('visibility', 'visible')
              restoreFocus()
            })
          })
        })
      })
    })
  })
})
