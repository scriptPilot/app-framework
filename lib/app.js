/*

  Purpose:
  - Load ressources
    - Framework info
    - Project info
    - Application configuration
    - App component
    - Routes
    - Theme
    - Essentiell vendor ressources
    - Optional vendor ressources
  - Manage global data
  - Manage DOM fix
  - Manage theme update
  - Manage phone frame
  - Manage application state
  - Init application

*/

'use strict'

/***************************/
/* Check Webpack inclusion */
/***************************/

if (process.env.APP_ROOT_FROM_SCRIPTS === undefined) {
  process.stdout.write('\x1bc' + 'Error: This file must be run by Webpack.\n\n')
  process.exit()
}

/*******************/
/* Load ressources */
/*******************/

// Framework info
let framework = require('../package.json')
let frameworkNPMversion = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'node_modules/.app-framework-cache/latest-npm-version.json')

// Project info
let project = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'package.json')

// Application configuration
let config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')

// App component
let appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')

// Routes
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

// Theme
let theme = window.localStorage.theme !== undefined && config.theme.split('-').indexOf(window.localStorage.theme) > -1 ? window.localStorage.theme : config.theme.split('-')[0]
if (process.env.NODE_ENV === 'development' && theme === 'material') require('./material')
else if (process.env.NODE_ENV === 'development') require('./ios')

// Essentiell vendor ressources
require('lodash')
require('../vendor/framework7/js/framework7.min.js')
let colors = require('./theme-colors')
let Vue = require('vue')
Vue.use(require('../vendor/framework7-vue/framework7-vue.min.js'))
require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')
require('./fixes.css')

// Optional vendor ressources
if (process.env.FONT_FRAMEWORK7 === 'true') require('framework7-icons/css/framework7-icons.css')
if (process.env.FONT_MATERIAL === 'true') require('../vendor/material-icons/css/material-icons.css')
if (process.env.FONT_ION === 'true') require('ionicons/dist/css/ionicons.min.css')
if (process.env.FONT_AWESOME === 'true') require('font-awesome/css/font-awesome.min.css')
let firebase = process.env.USE_FIREBASE_APP === 'true' ? require('firebase/app') : null
if (process.env.USE_FIREBASE_AUTH === 'true') require('firebase/auth')
if (process.env.USE_FIREBASE_DATABASE === 'true') require('firebase/database')
if (process.env.USE_FIREBASE_STORAGE === 'true') require('firebase/storage')

/**********************/
/* Manage global data */
/**********************/

Vue.mixin({
  computed: {
    data: function () {
      return this.$root.data
    }
  },
  methods: {
    saveData: function (path, value) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.data))
      // Add value to path
      data = window._.set(data, path, value)
      // Update root data object
      this.$root.$set(this.$root, 'data', data)
      // Update local storage
      window.localStorage.data = JSON.stringify(this.$root.data)
    },
    removeData: function (path) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.data))
      // Remove path
      window._.unset(data, path)
      // Update root data object
      this.$root.$set(this.$root, 'data', data)
      // Update local storage
      window.localStorage.data = JSON.stringify(this.$root.data)
    }
  }
})

/******************/
/* Manage DOM fix */
/******************/

/* eslint-disable */
// Prevent bouncing helper functions
var startY = 0
var handleTouchmove = function (evt) {
	// Get the element that was scrolled upon
  var el = evt.target
	// Check all parent elements for scrollability
  while (el !== document.body) {
		// Get style property
    let style = window.getComputedStyle(el)
    // Break loop if there was not style found
    if (!style) {
      break
    }
    // Ignore range input element
    if (el.nodeName === 'INPUT' && el.getAttribute('type') === 'range') {
      return
    }
    // Get parameters
    var scrolling = style.getPropertyValue('-webkit-overflow-scrolling')
    var overflowY = style.getPropertyValue('overflow-y')
    var height = parseInt(style.getPropertyValue('height'), 10)
    // Determine if the element should scroll
    var isScrollable = scrolling === 'touch' && (overflowY === 'auto' || overflowY === 'scroll')
    var canScroll = el.scrollHeight > el.offsetHeight


    // Prevent horizontal overflow scrolling
    /*
    var cl = el.getAttribute('class') !== null ? el.getAttribute('class').split(' ') : []
    if (cl.indexOf('page-content') !== -1) {
      if (el.scrollLeft < 0 || el.scrollLeft > el.scrollWidth - parseInt(style.getPropertyValue('width'))) {
        evt.preventDefault()
        //console.log(el.scrollLeft, el.scrollWidth, parseInt(style.getPropertyValue('width')))
      }
      //if (el.scrollLeft < 0 || el.scrollLeft > console.log(el.className, el.scrollLeft, style.getPropertyValue('width'))
    }
    */


    if (isScrollable && canScroll) {
				// Get the current Y position of the touch
      var curY = evt.touches ? evt.touches[0].screenY : evt.screenY
      //window.f7.alert('is scrollable and canscroll ' + el.className)

				// Determine if the user is trying to scroll past the top or bottom
				// In this case, the window will bounce, so we have to prevent scrolling completely
      var isAtTop = (startY <= curY && el.scrollTop === 0)
      var isAtBottom = (startY >= curY && el.scrollHeight - el.scrollTop === height)

				// Stop a bounce bug when at the bottom or top of the scrollable element
      if (isAtTop || isAtBottom) {
        evt.preventDefault()
      }

				// No need to continue up the DOM, we've done our job (not for special elements)
      var cl = el.getAttribute('class') !== null ? el.getAttribute('class').split(' ') : []
      if (cl.indexOf('timeline-horizontal') === -1 && cl.indexOf('tabbar-scrollable') === -1) {
      //if (window.Dom7(el).parents('.timeline-horizontal').length === 0 || window.Dom7(el).parents('.tabbar-scrollable').length === 0) {
//console.log('return ' + el.className)
        return
        //console.log('timeline', el.classList)
      }

    }

			// Test the next parent
    el = el.parentNode
  }

		// Stop the bouncing -- no parents are scrollable
    //window.f7.alert('stop bouncing ' + el.className)
  evt.preventDefault()
}
var handleTouchstart = function (evt) {
	// Store the first Y position of the touch
  startY = evt.touches ? evt.touches[0].screenY : evt.screenY
}
// Manage DOM fix mixin

let manageDOMfix = {
  mounted: function () {
    // Add missing statusbar overlay
    if (window.Dom7('#app .statusbar-overlay').length < 1) {
      window.Dom7('#app').prepend('<div class="statusbar-overlay"></div>')
    }
    // Transform subnavbar for material theme
    if (this.config.materialSubnavbarFix === true) {
      window.Dom7(document).on('page:init', function (e) {
        let subnavbar = window.Dom7(e.target).find('.subnavbar')
        if (subnavbar.length > 0) {
          window.Dom7(e.target).addClass('toolbar-fixed')
          window.Dom7(e.target).removeClass('with-subnavbar')
          subnavbar.prependTo(e.target).find('.page')
          subnavbar.find('.buttons-row').addClass('toolbar-inner')
          subnavbar.find('.buttons-row').removeClass('buttons-row')
          subnavbar.addClass('toolbar')
          subnavbar.addClass('tabbar')
          subnavbar.removeClass('subnavbar')
        }
      })
    }

    /*
    // Prevent bouncing
    let xStart = 0
    let yStart = 0
    window.Dom7(document).on('touchstart', function (e) {
      yStart = e.touches ? e.touches[0].screenY : e.screenY
      xStart = e.touches ? e.touches[0].screenX : e.screenX
    })
    window.Dom7(document).on('touchmove', function (e) {
      console.log(e)
    })
    //window.addEventListener('touchstart', handleTouchstart, false)
    //window.addEventListener('touchmove', handleTouchmove, false)
    */
  }
}
/* eslint-enable */

/**********************/
/* Manage theme update */
/**********************/

let manageThemeUpdate = {
  watch: {
    theme: function (newTheme, oldTheme) {
      if (config.theme.split('-').indexOf(newTheme) > -1) {
        // Update local storage
        window.localStorage.theme = newTheme
        // Update DOM
        window.location.reload()
      } else {
        // Rollback
        this.theme = oldTheme
      }
    },
    color: function (newColor, oldColor) {
      if (colors[theme][newColor] !== undefined) {
        // Update local storage
        window.localStorage.color = newColor
        // Update DOM
        window.Dom7('body')[0].className.split(' ').map(function (cName) {
          if (/^theme-[a-z]+$/.test(cName)) window.Dom7('body').removeClass(cName)
        })
        window.Dom7('body').addClass('theme-' + newColor)
      } else {
        // Rollback
        this.color = oldColor
      }
    },
    layout: function (newLayout, oldLayout) {
      if (newLayout === 'default' || newLayout === 'dark' || (newLayout === 'white' && theme === 'ios')) {
        // Update local storage
        window.localStorage.layout = newLayout
        // Update DOM
        window.Dom7('body')[0].className.split(' ').map(function (cName) {
          if (/^layout-[a-z]+$/.test(cName)) window.Dom7('body').removeClass(cName)
        })
        if (newLayout !== 'default') window.Dom7('body').addClass('layout-' + newLayout)
      } else {
        // Rollback
        this.layout = oldLayout
      }
    },
    statusbarBackgroundColor: function (newColor, oldColor) {
      if (/^[0-9a-f]{6}$/i.test(newColor)) newColor = '#' + newColor
      if (/^#[0-9a-f]{6}$/i.test(newColor)) {
        // Update local storage
        window.localStorage.statusbarBackgroundColor = newColor
        // Update DOM
        window.Dom7('.statusbar-overlay').css('background-color', newColor)
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.backgroundColorByHexString(newColor)
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.backgroundColorByHexString(newColor)
            })
          }
        }
      } else {
        // Rollback
        this.statusbarBackgroundColor = oldColor
      }
    },
    statusbarTextColor: function (newColor, oldColor) {
      if (newColor === 'white') {
        // Update local storage
        window.localStorage.statusbarTextColor = 'white'
        // Update DOM
        window.Dom7('meta[name=apple-mobile-web-app-status-bar-style]').attr('content', 'black')
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.styleLightContent()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.styleLightContent()
            })
          }
        }
      } else if (newColor === 'black') {
        // Update local storage
        window.localStorage.statusbarTextColor = 'black'
        // Update DOM
        window.Dom7('meta[name=apple-mobile-web-app-status-bar-style]').attr('content', 'black-translucent')
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.styleDefault()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.styleDefault()
            })
          }
        }
      } else {
        // Rollback
        this.statusbarTextColor = oldColor
      }
    },
    statusbarVisibility: function (newState, oldState) {
      if (newState === 'visible') {
        // Update local storage
        window.localStorage.removeItem('statusbarVisibility')
        // Update DOM
        if (window.f7.device.statusBar === true) {
          window.Dom7('html').addClass('with-statusbar-overlay')
        } else {
          window.Dom7('html').removeClass('with-statusbar-overlay')
        }
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.show()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.show()
            })
          }
        }
      } else if (newState === 'hidden') {
        // Update local storage
        window.localStorage.statusbarVisibility = 'hidden'
        // Update DOM
        window.Dom7('html').removeClass('with-statusbar-overlay')
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.hide()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.hide()
            })
          }
        }
      } else {
        // Rollback
        this.statusbarVisibility = oldState
      }
    }
  }
}

/**********************/
/* Manage phone frame */
/**********************/

function managePhoneFrame () {
}

/****************************/
/* Manage application state */
/****************************/

function manageApplicationState (app) {
  restoreState(app, function () {
    rememberState()
  })
}
function restoreState (app, callback) {
  restoreTheme(app, function () {
    restoreScrollOnPageLoad()
    restoreTabOnPageLoad()
    restoreFormInputOnPageLoad()
    restoreViews(function () {
      restoreOverlays(function () {
        window.Dom7('#app').css('visibility', 'visible')
        restoreFocus()
        callback()
      })
    })
  })
}
function restoreTheme (app, callback) {
  app.color = window.localStorage.color && colors[theme][window.localStorage.color] !== undefined ? window.localStorage.color : colors.default[theme]
  app.layout = window.localStorage.layout === 'dark' || (window.localStorage.layout === 'white' && theme === 'ios') ? window.localStorage.layout : 'default'
  app.statusbarBackgroundColor = window.localStorage.statusbarBackgroundColor !== undefined ? window.localStorage.statusbarBackgroundColor : app.config.statusbarBackgroundColor
  app.statusbarTextColor = window.localStorage.statusbarTextColor !== undefined ? window.localStorage.statusbarTextColor : app.config.statusbarTextColor
  app.statusbarVisibility = window.localStorage.statusbarVisibility !== undefined ? window.localStorage.statusbarVisibility : app.config.statusbarVisibility
  callback()
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
function rememberState () {
  setTimeout(function () {
    rememberViews()
    rememberScroll()
    rememberTab()
    rememberOverlays()
    rememberFormData()
    rememberFocus()
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

/*******************************/
/* Check App Framework updates */
/*******************************/

function checkFrameworkUpdates (app) {
  if (process.env.NODE_ENV === 'development' && frameworkNPMversion.latest !== undefined) {
    if (frameworkNPMversion.latest === 'unknown') {
      window.f7.alert('Failed to get latest NPM version. Please open an incident on GitHub.', 'App Framework')
    } else if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(frameworkNPMversion.latest)) {
      let currentVersion = framework.version.split('.')
      let npmVersion = frameworkNPMversion.latest.split('.')
      if (parseInt(currentVersion[0]) < parseInt(npmVersion[0]) ||
          parseInt(currentVersion[1]) < parseInt(npmVersion[1]) ||
          parseInt(currentVersion[2]) < parseInt(npmVersion[2])) {
        window.f7.alert('Please update App Framework to the latest version <b>' + frameworkNPMversion.latest + '</b> (currently ' + framework.version + '). CLI commands: "CTRL + C" to stop the development server and "npm update" to update App Framework.', 'App Framework')
      }
    } else {
      window.f7.alert('Failed to get parse NPM version. Please open an incident on GitHub.', 'App Framework')
    }
  }
}

/*******************************************************/
/* Reset local storage on App Framework version change */
/*******************************************************/

let manageLocalStorageReset = {
  created: function () {
    if (process.env.RESET_LOCAL_STORAGE === 'true' &&
        (!window.localStorage['app-framework-version'] || window.localStorage['app-framework-version'] !== this.frameworkVersion)) {
      let showMessage = window.localStorage['app-framework-version'] !== undefined
      for (let item in window.localStorage) {
        if (!/firebase:(.+)/.test(item) && item !== 'user') {
          window.localStorage.removeItem(item)
        }
      }
      window.localStorage['app-framework-version'] = this.frameworkVersion
      window.localStorage['showCacheResetAlert'] = showMessage
    }
  }
}

/************************/
/* Define text patterns */
/************************/

var f7Text = {
  en: {
    modalButtonOk: 'OK',
    modalButtonCancel: 'Cancel',
    modalPreloaderTitle: 'Loading ... ',
    modalUsernamePlaceholder: 'Username',
    modalPasswordPlaceholder: 'Password',
    smartSelectBackText: 'Back',
    smartSelectPopupCloseText: 'Close',
    smartSelectPickerCloseText: 'Done',
    notificationCloseButtonText: 'Close'
  },
  de: {
    modalButtonOk: 'OK',
    modalButtonCancel: 'Abbrechen',
    modalPreloaderTitle: 'Lädt ... ',
    modalUsernamePlaceholder: 'Benutzername',
    modalPasswordPlaceholder: 'Passwort',
    smartSelectBackText: 'Zurück',
    smartSelectPopupCloseText: 'Fertig',
    smartSelectPickerCloseText: 'Fertig',
    notificationCloseButtonText: 'OK'
  }
}
var text = {
  en: {
    cacheResetAlert: 'The application has been updated and the cache has been reset.'
  },
  de: {
    cacheResetAlert: 'Die Anwendung wurde aktualisiert und der Cache wurde zurückgesetzt.'
  }
}

/********************/
/* Init application */
/********************/

new Vue({ // eslint-disable-line
  el: '#app',
  template: '<app />',
  components: {app: appComponent},
  mixins: [manageLocalStorageReset, manageDOMfix, manageThemeUpdate],
  framework7: {
    root: '#app',
    routes: routes,
    material: theme === 'material',
    modalTitle: config.title
  },
  data: {
    // Info and configuration
    frameworkVersion: framework.version,
    version: project.version,
    config: config,
    user: null,
    language: config.defaultLanguage,
    // Theme settings
    theme: theme,
    colors: colors,
    color: null,
    layout: null,
    statusbarBackgroundColor: null,
    statusbarTextColor: null,
    statusbarVisibility: null,
    // Global data object
    data: {}
  },
  computed: {
    text: function () {
      return text[this.language] ? text[this.language] : text['en']
    }
  },
  watch: {
    language: function (newLanguage) {
      window.localStorage.language = newLanguage
      this.updateTextPatterns()
    }
  },
  methods: {
    onF7Init: function () {
      // Init Firebase
      if (process.env.USE_FIREBASE_APP === 'true') {
        firebase.initializeApp(process.env.NODE_ENV === 'production' ? config.firebase : config.devFirebase)
      }
      // Save app mode
      if (window.cordova !== undefined) {
        this.appMode = 'native'
      } else if (this.$f7.device.webView !== null || window.matchMedia('(display-mode: standalone)').matches) {
        this.appMode = 'homescreen'
      } else if (this.$f7.device.ios !== false || this.$f7.device.android !== false) {
        this.appMode = 'mobile'
      } else {
        this.appMode = 'desktop'
      }
      // Manage theme integration in production
      if (process.env.NODE_ENV === 'production' && (config.theme === 'ios-material' || config.theme === 'material-ios')) {
        // Remove unneeded link elements
        window.Dom7('link').each(function (i, el) {
          let href = window.Dom7(el).attr('href').match(/^(ios|material)\.(.+)\.css$/)
          if (href !== null && href[1] !== theme) {
            window.Dom7(el).remove()
          }
        })
        // Remove unneeded script elements
        window.Dom7('script').each(function (i, el) {
          let src = window.Dom7(el).attr('src').match(/^(ios|material)\.(.+)\.js$/)
          if (src !== null && src[1] !== theme) {
            window.Dom7(el).remove()
          }
        })
      }
      // Manage phone frame
      managePhoneFrame()
      // Manage application state
      manageApplicationState(this)
      // Check App Framework updates (in development only)
      checkFrameworkUpdates(this)
      // Show cache reset alert
      if (window.localStorage['showCacheResetAlert'] === 'true') {
        window.f7.alert(this.text.cacheResetAlert, function () {
          window.localStorage.removeItem('showCacheResetAlert')
        })
      }
    },
    updateTextPatterns: function () {
      let patterns = f7Text[this.language] ? f7Text[this.language] : f7Text['en']
      for (let p in patterns) {
        window.f7.params[p] = patterns[p]
      }
    }
  }
})
