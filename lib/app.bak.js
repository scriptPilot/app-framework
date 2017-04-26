/* Purpose: Provide client code */

/* eslint-disable */
/*

'use strict'

let manageGlobalDataObject = {
  computed: {
    data: function () {
      return this.$root.data
    }
  },
  created: function () {
    require('lodash')
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
}
let manageAppMode = {
  data: {
    appMode: null
  },
  watch: {
    f7init: function () {
      if (window.cordova !== undefined) {
        this.appMode = 'native'
      } else if (window.f7.device.webView !== null || window.matchMedia('(display-mode: standalone)').matches) {
        this.appMode = 'homescreen'
      } else if (window.f7.device.ios !== false || window.f7.device.android !== false) {
        this.appMode = 'mobile'
      } else {
        this.appMode = 'desktop'
      }
    }
  }
}
let manageFirebase = {
  data: {
    user: null,
    db: null,
    store: null,
    timestamp: null
  },
  created: function () {
    // Use Firebase
    if (process.env.USE_FIREBASE_APP === 'true') {
      // Include scripts
      let firebase = require('firebase/app')
      if (process.env.USE_FIREBASE_AUTH === 'true') require('firebase/auth')
      if (process.env.USE_FIREBASE_DATABASE === 'true') require('firebase/database')
      if (process.env.USE_FIREBASE_STORAGE === 'true') require('firebase/storage')
      // Initialize Firebase
      firebase.initializeApp(process.env.NODE_ENV === 'production' ? this.config.firebase : this.config.devFirebase)
      // Use auth service
      if (process.env.USE_FIREBASE_AUTH === 'true') {
        // Get initial user data from local storage
        this.user = window.localStorage.user !== undefined ? JSON.parse(window.localStorage.user) : null
        // Monitor user changes
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            this.user = {
              uid: user.uid,
              email: user.email
            }
          } else {
            this.user = null
          }
        })
      }
      // Use database service
      if (process.env.USE_FIREBASE_DATABASE === 'true') {
        this.db = function (path) {
          return firebase.database().ref(path)
        }
        this.timestamp = firebase.database.ServerValue.TIMESTAMP
      }
      // Use storage service
      if (process.env.USE_FIREBASE_STORAGE === 'true') {
        this.store = function (path) {
          return firebase.storage().ref(path)
        }
      }
    }
  },
  watch: {
    user: function (newUser) {
      // Update local storage
      if (newUser === null) {
        window.localStorage.removeItem('user')
      } else {
        window.localStorage.user = JSON.stringify(newUser)
      }
      // Update window object
      window.user = newUser
    },
    db: function (newDB) {
      // Update window object
      window.db = newDB
    },
    store: function (newStore) {
      // Update window object
      window.store = newStore
    },
    timestamp: function (newTimestamp) {
      // Update window object
      window.timestamp = newTimestamp
    }
  }
}
let manageLanguage = {
  data: {
    language: null
  },
  created: function () {
    this.language = window.localStorage.language
  },
  watch: {
    language: function (newLanguage, oldLanguage) {
      if (/^([a-z]{2})$/.test(newLanguage)) {
        // Update local storage
        window.localStorage.language = newLanguage
      } else {
        // Rollback
        this.language = oldLanguage !== null ? oldLanguage : this.config.defaultLanguage
      }
    }
  }
}
let manageTheme = {
  data: {
    theme: null,
    color: null,
    layout: null,
    colors: require('./theme-colors.json')
  },
  created: function () {
    this.theme = /^(ios|material)$/.test(window.localStorage.theme) ? window.localStorage.theme : this.config.theme.split('-')[0]
    if (process.env.NODE_ENV === 'development') {
      if (this.theme === 'material') require('./material')
      else require('./ios')
    } else if (this.config.theme === 'ios-material' || this.config.theme === 'material-ios') {
      window.Dom7('link').each(function (i, el) {
        let href = window.Dom7(el).attr('href').match(/^(ios|material)\.(.+)\.css$/)
        if (href !== null && href[1] !== this.theme) {
          console.log('remove', href[1], this.theme)
          // window.Dom7(el).remove()
        }
      })
      window.Dom7('script').each(function (i, el) {
        let src = window.Dom7(el).attr('src').match(/^(ios|material)\.(.+)\.js$/)
        if (src !== null && src[1] !== this.theme) {
          console.log('remove', href[1], this.theme)
          // window.Dom7(el).remove()
        }
      })
    }
  },
  watch: {
    f7init: function () {
      this.color = window.localStorage.color
      this.layout = window.localStorage.layout
    },
    theme: function (newTheme, oldTheme) {
      if (this.config.theme.split('-').indexOf(newTheme) > -1) {
        // Update local storage
        window.localStorage.theme = newTheme
        // Update DOM
        if (oldTheme !== null && oldTheme !== newTheme) {
          window.location.reload()
        }
      } else {
        // Rollback
        this.theme = oldTheme !== null ? oldTheme : this.config.theme.split('-')[0]
      }
    },
    color: function (newColor, oldColor) {
      if (this.colors[this.theme][newColor] !== undefined) {
        // Update local storage
        window.localStorage.color = newColor
        // Update DOM
        window.Dom7('body')[0].className.split(' ').map(function (cName) {
          if (/^theme-[a-z]+$/.test(cName)) window.Dom7('body').removeClass(cName)
        })
        window.Dom7('body').addClass('theme-' + newColor)
      } else {
        // Rollback
        this.color = oldColor !== null ? oldColor : this.colors.default[this.theme]
      }
    },
    layout: function (newLayout, oldLayout) {
      if (newLayout === 'default' || newLayout === 'dark' || (newLayout === 'white' && this.theme === 'ios')) {
        // Update local storage
        window.localStorage.layout = newLayout
        // Update DOM
        window.Dom7('body')[0].className.split(' ').map(function (cName) {
          if (/^layout-[a-z]+$/.test(cName)) window.Dom7('body').removeClass(cName)
        })
        if (newLayout !== 'default') window.Dom7('body').addClass('layout-' + newLayout)
      } else {
        // Rollback
        this.layout = oldLayout !== null ? oldLayout : 'default'
      }
    }
  }
}
let manageStatusbar = {
  data: {
    statusbarTextColor: null,
    statusbarBackgroundColor: null,
    statusbarVisibility: null
  },
  watch: {
    f7init: function () {
      this.statusbarTextColor = window.localStorage.statusbarTextColor
      this.statusbarBackgroundColor = window.localStorage.statusbarBackgroundColor
      this.statusbarVisibility = window.localStorage.statusbarVisibility
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
        this.statusbarTextColor = oldColor !== null ? oldColor : this.config.statusbarTextColor
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
        this.statusbarBackgroundColor = oldColor !== null ? oldColor : this.config.statusbarBackgroundColor
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
        this.statusbarVisibility = oldState !== null ? oldState : this.config.statusbarVisibility
      }
    }
  }
}
let manageApplicationState = {
  watch: {
    f7init: function () {
      let manageState = function (app) {
        function restoreState (app, callback) {
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
                 (el[0].classList.length > 0 ? '.' + el[0].classList.value.replace(/ /g, '.') : '')
        }
        function getViewUrl (el) {
          let viewSel = getViewSel(el)
          for (let v = 0; v < window.f7.views.length; v++) {
            if (window.f7.views[v].selector === viewSel) {
              return window.f7.views[v].url.replace(/^(\/)(.+)(\/)$/, '$2')
            }
          }
        }
        restoreState(app, function () {
          rememberState()
        })
      }
      manageState(this)
    }
  }
}
function initApp () {
  // Include ressources
  require('../vendor/framework7/js/framework7' + (process.env.NODE_ENV === 'production' ? '.min' : '') + '.js')
  let vue = require('vue/dist/vue.common.js')
  let framework7Vue = require('../vendor/framework7-vue/framework7-vue' + (process.env.NODE_ENV === 'production' ? '.min' : '') + '.js')
  let appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  let framework = require('../package.json')
  let project = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'package.json')
  let config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  require('./fixes.css')
  // Get routes from routes.json file and add login screen
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
  routes.push({
    path: '/app-framework-login-screen/',
    component: require('./login-screen.vue')
  })
  // Use Framework7Vue plugin
  vue.use(framework7Vue)
  // Enable global data object
  vue.mixin(manageGlobalDataObject)
  // Init Framework7-Vue application
  new vue({ // eslint-disable-line
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    mixins: [
      manageAppMode,
      manageFirebase,
      manageLanguage,
      manageTheme,
      manageStatusbar,
      manageIconFonts,
      manageApplicationState
    ],
    data: {
      frameworkVersion: framework.version,
      version: project.version,
      config: config,
      f7init: false,
      data: {}
    },
    framework7: {
      root: '#app',
      routes: routes,
      material: window.localStorage.theme === 'material' || (window.localStorage.theme === undefined && config.theme.split('-')[0] === 'material'),
      modalTitle: config.title
    },
    methods: {
      onF7Init: function () {
        this.f7init = true
      }
    }
  })
}
initApp()
*/
