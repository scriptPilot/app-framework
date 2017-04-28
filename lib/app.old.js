// Purpose: Provide client code

'use strict'

let globalMixins = {}
globalMixins.dataObject = {
  beforeCreate: function () {
    require('lodash')
  },
  created: function () {
    this.$root.globalDataObject = window.localStorage.globalDataObject !== undefined ? JSON.parse(window.localStorage.globalDataObject) : {}
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

let mixins = {}
mixins.routes = {
  beforeCreate: function () {
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
    // Add routes to Framework7 initialization object
    this.$options.framework7.routes = routes
  }
}
mixins.language = {
  data: {
    language: null
  },
  watch: {
    language: function (newLanguage, oldLanguage) {
      // New language is valid
      if (/^([a-z]{2})$/.test(newLanguage)) {
        // Update local storage
        window.localStorage.language = newLanguage
        // Update Framework7 text patterns
        let f7Text = {
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
        let useText = f7Text[newLanguage] ? f7Text[newLanguage] : f7Text['en']
        for (let item in useText) window.f7.params[item] = useText[item]
      // New language is not valid
      } else {
        // Rollback
        this.language = oldLanguage !== null ? oldLanguage : this.config.defaultLanguage
      }
    }
  },
  created: function () {
    // Restore local storage
    this.language = window.localStorage.language
  }
}
mixins.theme = {
  data: {
    theme: null
  },
  watch: {
    theme: function (newTheme, oldTheme) {
      // New theme is valid
      if (/^(ios|material)$/.test(newTheme)) {
        // Update local storage
        window.localStorage.theme = newTheme
        // Update DOM if new theme is different to old theme
        if (newTheme !== oldTheme && oldTheme !== null) {
          window.location.reload()
        }
      // New theme is not valid
      } else {
        // Rollback
        this.theme = oldTheme !== null ? oldTheme : this.config.theme.split('-')[0]
      }
    }
  },
  created: function () {
    // Restore local storage
    this.theme = window.localStorage.theme
    // Include theme in development mode
    if (process.env.NODE_ENV === 'development') {
      if (this.theme === 'material') require('./material')
      else require('./ios')
    }
  },
  mounted: function () {
    // Remove unneeded theme files in production mode
    if (process.env.NODE_ENV === 'production') {
      window.Dom7('link').each(function (i, el) {
        let href = window.Dom7(el).attr('href').match(/^(ios|material)\.(.+)\.css$/)
        if (href !== null && href[1] !== this.theme) {
          window.Dom7(el).remove()
        }
      }.bind(this))
      window.Dom7('script').each(function (i, el) {
        let src = window.Dom7(el).attr('src').match(/^(ios|material)\.(.+)\.js$/)
        if (src !== null && src[1] !== this.theme) {
          window.Dom7(el).remove()
        }
      }.bind(this))
    }
  }
}
mixins.color = {
  data: {
    color: null,
    colors: require('./theme-colors.json')
  },
  watch: {
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
    }
  },
  mounted: function () {
    // Restore local storage
    this.color = window.localStorage.color
  }

}
mixins.layout = {
  data: {
    layout: null
  },
  watch: {
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
  },
  created: function () {
    // Restore local storage
    this.layout = window.localStorage.layout
  }

}
mixins.addMissingStatusbar = {
  mounted: function () {
    if (window.Dom7('#app .statusbar-overlay').length < 1) {
      window.Dom7('#app').prepend('<div class="statusbar-overlay"></div>')
    }
  }
}
mixins.statusbarVisibility = {
  // Set initial value
  data: {
    statusbarVisibility: null
  },
  // Restore local storage
  created: function () {
    this.statusbarVisibility = window.localStorage.statusbarVisibility
  },
  // Watch changes
  watch: {
    statusbarVisibility: function (newState, oldState) {
      if (newState === 'visible' || newState === 'hidden') {
        window.localStorage.statusbarVisibility = newState
        this.update()
      } else {
        this.statusbarVisibility = oldState !== null ? oldState : this.config.statusbarVisibility
      }
    },
    deviceReady: function () {
      this.update()
    },
    f7Ready: function () {
      this.update()
    }
  },
  // Do change
  methods: {
    update: function () {
      if (this.deviceReady && this.f7Ready) {
        if (this.statusbarVisibility === 'visible') {
          window.StatusBar.show()
          if (window.f7.device.statusBar === true) {
            window.Dom7('html').addClass('with-statusbar-overlay')
          }
        } else {
          window.StatusBar.hide()
          window.Dom7('html').removeClass('with-statusbar-overlay')
        }
      }
    }
  }
}
mixins.statusbarTextColor = {
  // Set initial value
  data: {
    statusbarTextColor: null
  },
  // Restore local storage
  created: function () {
    this.statusbarTextColor = window.localStorage.statusbarTextColor
  },
  // Watch changes
  watch: {
    statusbarTextColor: function (newColor, oldColor) {
      if (newColor === 'white' || newColor === 'black') {
        window.localStorage.statusbarTextColor = newColor
        this.update()
      } else {
        this.statusbarTextColor = oldColor !== null ? oldColor : this.config.statusbarTextColor
      }
    },
    deviceReady: function () {
      this.update()
    }
  },
  // Do change
  methods: {
    update: function () {
      if (this.deviceReady) {
        if (this.statusbarTextColor === 'white') {
          window.StatusBar.styleBlackTranslucent()
        } else {
          window.StatusBar.styleDefault()
        }
      }
    }
  }
}
mixins.statusbarBackgroundColor = {
  // Set initial value
  data: {
    statusbarBackgroundColor: null
  },
  // Restore local storage
  created: function () {
    this.statusbarBackgroundColor = window.localStorage.statusbarBackgroundColor
  },
  // Watch changes
  watch: {
    statusbarBackgroundColor: function (newColor, oldColor) {
      if (/^[0-9a-f]{6}$/i.test(newColor)) newColor = '#' + newColor
      if (/^#[0-9a-f]{6}$/i.test(newColor)) {
        window.localStorage.statusbarBackgroundColor = newColor
        this.update()
      } else {
        this.statusbarBackgroundColor = oldColor !== null ? oldColor : this.config.statusbarBackgroundColor
      }
    },
    domReady: function () {
      this.update()
    }
  },
  // Do change
  methods: {
    update: function () {
      if (this.domReady) {
        window.Dom7('.statusbar-overlay').css('background-color', this.statusbarBackgroundColor)
      }
    }
  }
}
mixins.iconFonts = {
  beforeCreate: function () {
    // Load icon fonts if configured
    if (process.env.FONT_FRAMEWORK7 === 'true') require('framework7-icons/css/framework7-icons.css')
    if (process.env.FONT_MATERIAL === 'true') require('../vendor/material-icons/css/material-icons.css')
    if (process.env.FONT_ION === 'true') require('ionicons/dist/css/ionicons.css')
    if (process.env.FONT_AWESOME === 'true') require('font-awesome/css/font-awesome.css')
  }
}
mixins.firebase = {
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
mixins.fixes = {
  beforeCreate: function () {
    // Style fixes
    require('./fixes.css')
  }
}
mixins.tranformSubnavbarForMaterial = {
  beforeMount: function () {
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
  }
}
mixins.appMode = {
  data: {
    appMode: null
  },
  created: function () {
    this.doOnF7Init.push((cb) => {
      if (window.cordova !== undefined) {
        this.appMode = 'native'
      } else if (window.f7.device.webView !== null || window.matchMedia('(display-mode: standalone)').matches) {
        this.appMode = 'homescreen'
      } else if (window.f7.device.ios !== false || window.f7.device.android !== false) {
        this.appMode = 'mobile'
      } else {
        this.appMode = 'desktop'
      }
      cb()
    })
  }
}
mixins.state = {
  created: function () {
    this.doOnF7Init.push((cb) => {
      function restoreState (callback) {
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
      restoreState(() => {
        rememberState()
        this.stateReady = true
        cb()
      })
    })
  }
}
mixins.cacheReset = {
  created: function () {
    if (this.config.resetLocalStorageOnVersionChange === true && (!window.localStorage['app-framework-version'] || window.localStorage['app-framework-version'] !== this.framework.version)) {
      // Empty local storage
      for (let item in window.localStorage) {
        if (!/firebase:(.+)/.test(item) && item !== 'user') {
          window.localStorage.removeItem(item)
        }
      }
      // Update framework version in local storage
      window.localStorage['app-framework-version'] = this.framework.version
      // Show notification
      this.doOnF7Init.push((cb) => {
        let text = {
          en: 'The application has been updated and the cache has been reset.',
          de: 'Die Anwendung wurde aktualisiert und der Cache wurde zurückgesetzt.'
        }
        window.f7.alert(text[this.language] ? text[this.language] : text['en'], cb)
      })
    }
  }
}
mixins.npmUpdateCheck = {
  created: function () {
    this.doOnF7Init.push((cb) => {
      let npm = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'node_modules/.app-framework-cache/latest-npm-version.json')
      if (process.env.NODE_ENV === 'development' && npm !== undefined && npm.latest !== undefined) {
        if (npm.latest === 'unknown') {
          window.f7.alert('Failed to get latest NPM version. Please open an incident on GitHub.', 'App Framework')
        } else if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(npm.latest)) {
          let currentVersion = this.framework.version.split('.')
          let npmVersion = npm.latest.split('.')
          if (parseInt(currentVersion[0]) < parseInt(npmVersion[0]) ||
              parseInt(currentVersion[1]) < parseInt(npmVersion[1]) ||
              parseInt(currentVersion[2]) < parseInt(npmVersion[2])) {
            window.f7.alert('Please update App Framework to the latest version <b>' + npm.latest + '</b>.<br /><br />You have installed version ' + this.framework.version + '.<br /><br />CLI commands: "CTRL + C" to stop the development server and "npm update" to update App Framework.', 'App Framework')
          }
        } else {
          window.f7.alert('Failed to get parse NPM version. Please open an incident on GitHub.', 'App Framework')
        }
      } else {
        cb()
      }
    })
  }
}

function initF7VueApp () {
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
  // Load global mixins
  Object.keys(globalMixins).map(function (name) { vue.mixin(globalMixins[name]) })
  // Get application-only mixins
  let appMixins = []
  Object.keys(mixins).map(function (name) { appMixins.push(mixins[name]) })
  // Init Framework7-Vue application
  new vue({ // eslint-disable-line
    // Set root element, template, components and mixins
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    mixins: appMixins,
    // Set initial data
    data: {
      // States
      domReady: false,
      deviceReady: false,
      f7Ready: false,
      stateReady: false,
      // List of functions to call after F7 init
      doOnF7Init: [],
      // Framework and project information
      framework: framework,
      project: project,
      // Application configuration
      config: config,
      // Global data object
      globalDataObject: {}
    },
    // Get domReady state
    mounted: function () {
      this.domReady = true
    },
    // Get deviceReady state
    created: function () {
      if (window.StatusBar) {
        this.deviceReady = true
      } else {
        window.Dom7(document).on('deviceready', () => {
          this.deviceReady = true
          window.StatusBar.styleDefault()
          window.StatusBar.backgroundColorByName('red')
          window.Dom7('.statusbar-overlay').css('background', 'yellow')
        })
      }
    },
    // Get appReady state
    computed: {
      appReady: function () {
        return this.f7Ready && this.stateReady && (window.cordova === undefined || this.deviceReady)
      }
    },
    // Basic Framework7 initialization parameters
    framework7: {
      root: '#app',
      modalTitle: config.title
    },
    methods: {
      onF7Init: function () {
        // Update Framework7 ready state
        this.f7Ready = true
        // Run listed functions
        function doNow (functions) {
          if (functions.length > 0) {
            functions.shift()(function () {
              doNow(functions)
            })
          }
        }
        doNow(this.doOnF7Init)
      }
    }
  })
}

initF7VueApp()
