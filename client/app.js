/* Purpose: Provide client code */

'use strict'

import _ from 'lodash'

function initCordova (callback) {
  if (window.cordova !== undefined) {
    if (window.StatusBar !== undefined) {
      callback()
    } else {
      document.addEventListener('deviceready', () => {
        callback()
      }, false)
    }
  } else {
    callback()
  }
}

let manageComponentData = {
  created: function () {
    this.$nextTick(function () {
      this.$pageKey = this.getKey()
      this.restoreData()
    })
  },
  updated: function () {
    this.rememberData()
  },
  methods: {
    restoreData: function () {
      if (this.$pageKey) {
        if (window.localStorage[this.$pageKey]) {
          let data = JSON.parse(window.localStorage[this.$pageKey])
          for (let item in data) {
            this.$data[item] = data[item]
          }
        }
      }
    },
    rememberData: function () {
      if (this.$pageKey) {
        let data = {}
        for (let item in this.$data) {
          data[item] = this.$data[item]
        }
        window.localStorage[this.$pageKey] = JSON.stringify(data)
      }
    },
    getKey: function () {
      if (!this.$options._componentTag && this.$el && this.$el.f7PageData && this.$el.f7PageData.view && this.$el.f7PageData.url) {
        let url = this.$el.f7PageData.url
        if (url.substr(0, 1) === '/') url = url.substr(1)
        if (url.substr(url.length - 1, 1) === '/') url = url.substr(0, url.length - 1)
        let view = this.$el.f7PageData.view.selector
        let key = 'data|' + view + '|' + url
        return key
      } else {
        return null
      }
    }
  }
}
let easierGlobalDataObject = {
  computed: {
    // Legacy support
    $get () {
      return this.$root.data
    }
  },
  methods: {
    $db (...args) {
      return this.$root.$db(...args)
    },
    // Legacy support
    $save (...args) {
      this.$root.saveData(...args)
    },
    $remove (...args) {
      this.$root.removeData(...args)
    }
  }
}
let easierLanguagePattern = {
  methods: {
    $lang (key, data = null) {
      return this.$root.getLanguagePattern(key, data)
    }
  }
}
let easierFirebase = {
  computed: {
    // Authentication
    $fireAuth () {
      return window.firebase && window.firebase.auth ? window.firebase.auth : null
    },
    $user () {
      return this.$root.user
    },
    // Realtime Database
    $fireDB () {
      return window.firebase && window.firebase.database ? (ref) => { return window.firebase.database().ref(ref) } : null
    },
    // Cloud Storage
    $fireStore () {
      return window.firebase && window.firebase.storage ? (ref) => { return window.firebase.storage().ref(ref) } : null
    }
  }
}

let mixins = {}
mixins.loadConfig = {
  data: {
    // Load App Framework version
    frameworkVersion: process.env.FRAMEWORK_VERSION,
    // Load project version
    version: process.env.PROJECT_VERSION,
    // Load application configuration
    config: require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  },
  // Update Framework7 modal title
  created: function () {
    this.$options.framework7.modalTitle = this.config.title
  }
}
mixins.loadRoutes = {
  data () {
    return {
      loginRoutes: [],
      loginRequiringPages: {},
      loginRequiringPagesOnStart: false
    }
  },
  watch: {
    f7Ready () {
      // Check default routes for login requiring pages
      this.$f7.views.forEach((view) => {
        if (view.params.url && this.urlRequiresLogin(view.params.url)) {
          // Remember URL (popup will be opened on init by login-screen.vue)
          this.$set(this.loginRequiringPages, view.selector, view.params.url)
          this.loginRequiringPagesOnStart = true
        }
      })
    }
  },
  methods: {
    urlRequiresLogin: function (url) {
      let loginRequired = false
      this.loginRoutes.map(route => {
        let regexp = new RegExp('^' + route.replace(/\/:[a-zA-Z0-9-_]+\//g, '\/[a-zA-Z0-9-]+\/') + '$') // eslint-disable-line
        url = url.match(/([0-9a-zA-Z-/]+)/)[1]
        if (url.substr(0, 1) !== '/') url = '/' + url
        if (url.substr(url.length - 1) !== '/') url = url + '/'
        if (regexp.test(url)) loginRequired = true
      })
      return loginRequired
    }
  },
  created: function () {
    // Load routes file
    let routes = require(process.env.APP_ROOT_FROM_SCRIPTS + 'routes.json')
    for (let r = 0; r < routes.length; r++) {
      // Page routes
      try {
        routes[r].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].component)
      } catch (err) {
        console.error('Failed to load page component "' + routes[r].component + '". Please update the routes.json file.')
      }
      // Login required?
      if (routes[r].login === true) this.loginRoutes.push(routes[r].path)
      // Tab routes
      if (Array.isArray(routes[r].tabs)) {
        for (let t = 0; t < routes[r].tabs.length; t++) {
          try {
            routes[r].tabs[t].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].tabs[t].component)
          } catch (err) {
            console.error('Failed to load page component "' + routes[r].tabs[t].component + '". Please update the routes.json file.')
          }
          // Login required?
          if (routes[r].tabs[t].login === true) {
            this.loginRoutes.push(routes[r].path + routes[r].tabs[t].path.substr(1))
          }
          // Alternate tab routes
          if (Array.isArray(routes[r].tabs[t].routes)) {
            for (let a = 0; a < routes[r].tabs[t].routes.length; a++) {
              try {
                routes[r].tabs[t].routes[a].component = require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + routes[r].tabs[t].routes[a].component)
              } catch (err) {
                console.error('Failed to load page component "' + routes[r].tabs[t].routes[a].component + '". Please update the routes.json file.')
              }
              // Login required?
              if (routes[r].tabs[t].routes[a].login === true) {
                this.loginRoutes.push(routes[r].path + routes[r].tabs[t].path.substr(1) + routes[r].tabs[t].routes[a].path.substr(1))
              }
            }
          }
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
    // Add preroute function for login-requiring pages to Framework7
    this.$options.framework7.preroute = (view, options) => {
      // User not logged in, no back link, no dynamic content
      if (this.user !== null || options.isBack === true || options.url === undefined) {
        return true
      } else {
        // Login required for all pages or for this page
        if (this.config.loginRequiredForAllPages || this.urlRequiresLogin(options.url)) {
          // Remember URL
          this.$set(this.loginRequiringPages, view.selector, options.url)
          // Show login popup
          this.$f7.popup('#app-framework-login-popup')
          return false
        } else {
          return true
        }
      }
    }
  }
}
mixins.loadIconFonts = {
  created: function () {
    if (process.env.FONT_FRAMEWORK7 === 'true') require('framework7-icons/css/framework7-icons.css')
    if (process.env.FONT_MATERIAL === 'true') require('../vendor/material-icons/material-icons.css')
    if (process.env.FONT_ION === 'true') require('ionicons/dist/css/ionicons.css')
    if (process.env.FONT_AWESOME === 'true') require('font-awesome/css/font-awesome.css')
  }
}
mixins.manageFirebase = {
  // Set initial values
  data: {
    user: null,
    db: null,
    store: null,
    timestamp: null
  },
  // Init Firebase
  created: function () {
    // Use Firebase
    if (process.env.USE_FIREBASE_APP === 'true') {
      // Include scripts
      let firebase = require('firebase/app')
      if (process.env.USE_FIREBASE_AUTH === 'true') require('firebase/auth')
      if (process.env.USE_FIREBASE_DATABASE === 'true') require('firebase/database')
      if (process.env.USE_FIREBASE_STORAGE === 'true') require('firebase/storage')
      // Initialize Firebase
      window.firebase = firebase.initializeApp(this.config[process.env.FIREBASE_CONFIG])
      // Use auth service
      if (process.env.USE_FIREBASE_AUTH === 'true') {
        // Get initial user data from local storage
        this.user = window.localStorage.user ? JSON.parse(window.localStorage.user) : null
        // Clean local storage if user is not logged in initially
        if (!window.localStorage.user) this.cleanLocalStorageAfterLogut()
        // Monitor user changes
        firebase.auth().onAuthStateChanged(user => {
          this.user = user ? {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL
          } : null
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
  // Watch for changes
  watch: {
    user: function (newUser) {
      // Update local storage
      if (newUser === null) {
        window.localStorage.removeItem('user')
        this.cleanLocalStorageAfterLogut()
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
  },
  methods: {
    cleanLocalStorageAfterLogut: function () {
      for (let item in window.localStorage) {
        // History
        if (/^urls\|([0-9a-zA-Z._-]+)$/.test(item)) {
          let urls = JSON.parse(window.localStorage[item])
          let newUrls = []
          let loginRequired = false
          urls.map((url) => {
            if (this.urlRequiresLogin(url)) {
              loginRequired = true
            } else if (!loginRequired) {
              newUrls.push(url)
            }
          })
          window.localStorage[item] = JSON.stringify(newUrls)
        // Component data and scroll positions
        } else if (/(scroll|data)\|[0-9a-zA-Z._-]+\|(.+)$/.test(item)) {
          let url = item.match(/(scroll|data)\|[0-9a-zA-Z._-]+\|(.+)$/)[2]
          if (this.urlRequiresLogin(url)) {
            window.localStorage.removeItem(item)
          }
        }
      }
    }
  }
}
mixins.sortObject = {
  beforeCreate: function () {
    window.sortObject = require('./sort-object')
  }
}
mixins.resetCache = {
  created: function () {
    if (this.config.resetLocalStorageOnVersionChange === true &&
        window.localStorage.projectVersion !== undefined &&
        window.localStorage.projectVersion !== this.projectVersion) {
      // Remember alert
      let text = {
        en: 'The application has been updated and the cache has been reset.',
        de: 'Die Anwendung wurde aktualisiert und der Cache wurde zurückgesetzt.'
      }
      if (window.localStorage.language && text[window.localStorage.language]) {
        window.localStorage.cacheResetAlert = text[window.localStorage.language]
      } else if (text[window.localStorage.language]) {
        window.localStorage.cacheResetAlert = text[window.localStorage.language]
      } else {
        window.localStorage.cacheResetAlert = text['en']
      }
      // Empty local storage
      for (let item in window.localStorage) {
        if (!/(firebase:(.+)|user|cacheResetAlert)/.test(item) && item !== 'user') {
          window.localStorage.removeItem(item)
        }
      }
    }
    // Update framework version in local storage
    window.localStorage.projectVersion = this.projectVersion
  },
  // Show Alert
  watch: {
    stateReady: function () {
      if (window.localStorage.cacheResetAlert !== undefined) {
        window.f7.alert(window.localStorage.cacheResetAlert, () => {
          // Prevent to show alert twice
          window.localStorage.removeItem('cacheResetAlert')
        })
      }
    }
  }
}
mixins.checkNPMupdates = {
  watch: {
    stateReady: function () {
      if (process.env.NODE_ENV === 'development') {
        let npm = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'node_modules/.app-framework-cache/latest-npm-version.json')
        if (npm !== undefined && npm.latest !== undefined) {
          if (npm.latest === 'unknown') {
            window.f7.alert('Failed to get latest NPM version. Please open an incident on GitHub.', 'App Framework')
          } else if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(npm.latest)) {
            let currentVersion = this.frameworkVersion.split('.')
            let npmVersion = npm.latest.split('.')
            if (parseInt(currentVersion[0]) < parseInt(npmVersion[0]) ||
                parseInt(currentVersion[1]) < parseInt(npmVersion[1]) ||
                parseInt(currentVersion[2]) < parseInt(npmVersion[2])) {
              window.f7.alert('Please update App Framework to the latest version <b>' + npm.latest + '</b>.<br /><br />You have installed version ' + this.frameworkVersion + '.<br /><br />The CLI commands are "CTRL + C" to stop the development server and "npm update" to update App Framework.', 'App Framework')
            }
          } else {
            window.f7.alert('Failed to get parse NPM version. Please open an incident on GitHub.', 'App Framework')
          }
        }
      }
    }
  }
}
mixins.initWorkarounds = {
  data: {
    materialCodepoints: null
  },
  beforeCreate: function () {
    require('./workarounds.css')
    // Actions not show/hide properly
    window.Dom7(document).on('actions:open', (e) => {
      e.target.__vue__.opened = true
    })
    window.Dom7(document).on('actions:close', (e) => {
      e.target.__vue__.opened = false
    })
    // Login screen show/hide properly
    window.Dom7(document).on('page:init', (e) => {
      window.Dom7(e.target).find('.login-screen.modal-out').hide()
    })
  },
  created: function () {
    // Materical Icons not shown in older browsers / android versions
    if (process.env.FONT_MATERIAL) {
      this.materialCodepoints = require('./material-codepoints.json')
    }
  }
}
mixins.manageGlobalDataObject = {
  // Set initial data
  data: {
    data: {}
  },
  // Methods to add or remove data
  methods: {
    $db (...args) {
      // Check arguments
      if (args.length < 1 || args.length > 2 || typeof args[0] !== 'string') {
        throw new Error('$db() should have one or two arguments, the first one should be a string')
      // Read data
      } else if (args.length === 1) {
        return _.get(this.data, args[0], undefined)
      // Write/Remove data
      } else {
        // Clone current data
        const data = _.cloneDeep(this.data)
        // Update data
        if (args[1] !== null) {
          _.set(data, args[0], args[1])
        // Remove data
        } else {
          _.unset(data, args[0])
        }
        // Save data to Vue object
        this.$set(this, 'data', data)
        // Save data to local storage
        if (window.cordova) {
          window.NativeStorage.setItem('data', data)
        } else {
          window.localStorage.data = JSON.stringify(this.data)
        }
      }
    },
    // Legacy support
    saveData: function (path, value) {
      this.$db(path, value)
    },
    removeData: function (path) {
      this.$db(path, null)
    }
  },
  // Restore local storage
  created: function () {
    if (window.cordova) {
      const self = this
      window.NativeStorage.getItem('data', function (data) {
        self.data = data
      }, function () {
        self.data = {}
      })
    } else {
      this.data = window.localStorage.data !== undefined ? JSON.parse(window.localStorage.data) : {}
    }
  }
}
mixins.appMode = {
  data: {
    appMode: null
  },
  created: function () {
    if (window.cordova !== undefined) {
      this.appMode = 'native'
    } else if (window.Framework7.prototype.device.webView !== null || window.matchMedia('(display-mode: standalone)').matches) {
      this.appMode = 'homescreen'
    } else if (window.Framework7.prototype.device.ios !== false || window.Framework7.prototype.device.android !== false) {
      this.appMode = 'mobile'
    } else {
      this.appMode = 'desktop'
    }
  }
}
mixins.manageApplicationFrame = {
  beforeCreate: function () {
    require('./application-frame.css')
  },
  created: function () {
    this.updatePhoneFrame()
    window.Dom7(window).on('resize', this.updatePhoneFrame)
  },
  methods: {
    updatePhoneFrame: function () {
      // Get attributes
      let windowHeight = window.innerHeight
      let windowWidth = window.innerWidth
      let appMaxHeight = this.$root.config.limitApplicationHeight
      let appMaxWidth = this.$root.config.limitApplicationWidth
      let showPhoneFrame = this.$root.config.showPhoneFrameOnDesktop
      let desktopMode = this.appMode === 'desktop'
      // Calculate attributes
      let phoneFrameMinHeight = appMaxHeight + 250
      let phoneFrameMinWidth = appMaxWidth + 50
      let mode = showPhoneFrame && desktopMode && windowHeight >= phoneFrameMinHeight && windowWidth >= phoneFrameMinWidth
        ? 'phoneFrame'
        : desktopMode && windowHeight >= appMaxHeight && windowWidth >= appMaxWidth
          ? 'limitBoth'
          : desktopMode && windowHeight >= appMaxHeight
            ? 'limitHeight'
            : desktopMode && windowWidth >= appMaxWidth
              ? 'limitWidth'
              : 'noFrame'
      // Update classes
      if (mode === 'phoneFrame') {
        window.Dom7('body').css('background', this.$root.config.phoneFrameBodyBackgroundColor)
        window.Dom7('body').addClass('phoneFrame')
        window.Dom7('body').removeClass('limitHeight')
        window.Dom7('body').removeClass('limitWidth')
      } else if (mode === 'limitBoth') {
        window.Dom7('body').css('background', this.$root.config.limitedSizeBodyBackgroundColor)
        window.Dom7('body').removeClass('phoneFrame')
        window.Dom7('body').addClass('limitHeight')
        window.Dom7('body').addClass('limitWidth')
      } else if (mode === 'limitHeight') {
        window.Dom7('body').css('background', this.$root.config.limitedSizeBodyBackgroundColor)
        window.Dom7('body').removeClass('phoneFrame')
        window.Dom7('body').addClass('limitHeight')
        window.Dom7('body').removeClass('limitWidth')
      } else if (mode === 'limitWidth') {
        window.Dom7('body').css('background', this.$root.config.limitedSizeBodyBackgroundColor)
        window.Dom7('body').removeClass('phoneFrame')
        window.Dom7('body').removeClass('limitHeight')
        window.Dom7('body').addClass('limitWidth')
      } else {
        window.Dom7('body').removeClass('phoneFrame')
        window.Dom7('body').removeClass('limitHeight')
        window.Dom7('body').removeClass('limitWidth')
      }
      // Update size and position
      if (mode === 'phoneFrame' || mode === 'limitBoth' || mode === 'limitHeight') {
        window.Dom7('#frame').css('height', appMaxHeight + 'px')
        window.Dom7('#frame').css('top', ((windowHeight - appMaxHeight) / 2) + 'px')
      } else {
        window.Dom7('#frame').css('height', windowHeight + 'px')
        window.Dom7('#frame').css('top', '0')
      }
      if (mode === 'phoneFrame' || mode === 'limitBoth' || mode === 'limitWidth') {
        window.Dom7('#frame').css('width', appMaxWidth + 'px')
        window.Dom7('#frame').css('left', ((windowWidth - appMaxWidth) / 2) + 'px')
      } else {
        window.Dom7('#frame').css('width', windowWidth + 'px')
        window.Dom7('#frame').css('left', '0')
      }
    }
  }
}
mixins.addMissingStatusbar = {
  mounted: function () {
    if (window.Dom7('#app .statusbar-overlay').length < 1) {
      window.Dom7('#app').prepend('<div class="statusbar-overlay"></div>')
    }
  }
}
mixins.tranformSubnavbarForMaterial = {
  created: function () {
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
mixins.manageLanguage = {
  // Set default value
  data: {
    language: null
  },
  // Watch for change
  watch: {
    language: function (newLanguage, oldLanguage) {
      // New language is valid
      if (/^[a-z]{2}$/.test(newLanguage)) {
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
        // Rollback to old or configuration value
        this.language = oldLanguage !== null ? oldLanguage : this.config.language
      }
    }
  },
  // Restore local storage
  created: function () {
    this.language = window.localStorage.language ? window.localStorage.language : this.config.defaultLanguage
  }
}
mixins.manageTheme = {
  // Set initial value
  data: function () {
    return {
      theme: null
    }
  },
  // Watch for change
  watch: {
    theme: function (newTheme, oldTheme) {
      // New theme is valid
      if (/^(ios|material)$/.test(newTheme) && this.config.theme.split('-').indexOf(newTheme) >= 0) {
        // New theme is different
        if (newTheme !== oldTheme) {
          // Update local storage
          window.localStorage.theme = newTheme
          // First theme change
          if (oldTheme === null) {
            // Update Framework7 initialization object
            this.$options.framework7.material = newTheme === 'material'
            // Load theme file in development mode
            if (process.env.NODE_ENV === 'development') {
              if (newTheme === 'ios') require('./ios')
              else require('./material')
            // Remove unneeded theme tags in production mode
            } else {
              window.Dom7('link').each((i, el) => {
                let href = window.Dom7(el).attr('href').match(/^(ios|material)\.(.+)\.css$/)
                if (href !== null && href[1] !== newTheme) {
                  window.Dom7(el).remove()
                }
              })
              window.Dom7('script').each(function (i, el) {
                let src = window.Dom7(el).attr('src').match(/^(ios|material)\.(.+)\.js$/)
                if (src !== null && src[1] !== newTheme) {
                  window.Dom7(el).remove()
                }
              })
            }
          // Another theme change
          } else {
            // Reload the application
            window.location.reload()
          }
        }
      // New theme is not valid
      } else {
        // Rollback old value or configuration
        this.theme = oldTheme !== null ? oldTheme : this.config.theme.split('-')[0]
      }
    }
  },
  // Restore local storage
  created: function () {
    this.theme = window.localStorage.theme ? window.localStorage.theme : this.config.theme.split('-')[0]
  }
}
mixins.manageColor = {
  // Set initial data
  data: {
    color: null,
    colors: require('./theme-colors')
  },
  // Watch changes
  watch: {
    color: function (newColor, oldColor) {
      // New color is valid
      if (this.colors[this.theme][newColor] !== undefined) {
        // Update local storage
        window.localStorage.color = newColor
        // Update DOM
        window.Dom7('body')[0].className.split(' ').map(function (cName) {
          if (/^theme-[a-z]+$/.test(cName)) window.Dom7('body').removeClass(cName)
        })
        window.Dom7('body').addClass('theme-' + newColor)
      // New color is not valid
      } else {
        // Rollback old, config or default value
        this.color = oldColor !== null ? oldColor : this.colors[this.theme][this.config.color] !== undefined ? this.config.color : this.colors.default[this.theme]
      }
    }
  },
  // Restore local storage
  created: function () {
    this.color = window.localStorage.color
  }
}
mixins.manageLayout = {
  // Set initial value
  data: {
    layout: null
  },
  // Watch changes
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
        // Rollback old or config value
        this.layout = oldLayout !== null ? oldLayout : this.config.layout
      }
    }
  },
  // Restore local storage
  created: function () {
    this.layout = window.localStorage.layout
  }
}
mixins.manageStatusbarVisibility = {
  // Set variable
  data: {
    statusbarVisibility: null
  },
  // Deactivate automatic status bar handling
  beforeCreate: function () {
    this.$options.framework7.statusbarOverlay = false
  },
  // Handle change
  watch: {
    statusbarVisibility: function (newState, oldState) {
      this.updateStatusBarVisibility(newState, oldState)
    }
  },
  created: function () {
    // Restore / set initial value
    if (window.localStorage.statusbarVisibility !== undefined) {
      this.statusbarVisibility = JSON.parse(window.localStorage.statusbarVisibility)
    } else {
      this.statusbarVisibility = this.config.statusbarVisibility
    }
    // Update on resize
    window.Dom7(window).on('resize', () => {
      this.updateStatusBarVisibility(this.statusbarVisibility, this.statusbarVisibility)
    })
  },
  // Methods
  methods: {
    updateStatusBarVisibility: function (newState, oldState) {
      if (newState === true || newState === false) {
        // Update local storage
        window.localStorage.statusbarVisibility = newState
        // Update cordova
        if (window.StatusBar) {
          if (newState === true) {
            window.StatusBar.show()
          } else {
            window.StatusBar.hide()
          }
        }
        // Update DOM
        if ((window.StatusBar !== undefined && newState === true && window.Framework7.prototype.device.statusBar === true) ||
            (window.StatusBar === undefined && window.Framework7.prototype.device.statusBar === true && (window.Framework7.prototype.device.iphone === false || window.Dom7('html').width() < window.Dom7('html').height()))) {
          window.Dom7('html').addClass('with-statusbar-overlay')
        } else {
          window.Dom7('html').removeClass('with-statusbar-overlay')
        }
      } else {
        // Rollback old or config value
        this.statusbarVisibility = oldState !== null ? oldState : this.config.statusbarVisibility
      }
    }
  }
}
mixins.manageStatusbarTextColor = {
  // Set variable
  data: {
    statusbarTextColor: null
  },
  // Handle change
  watch: {
    statusbarTextColor: function (newColor, oldColor) {
      if (newColor === 'black' || newColor === 'white') {
        // Update local storage
        window.localStorage.statusbarTextColor = newColor
        // Update cordova
        if (window.StatusBar) {
          if (newColor === 'white') {
            window.StatusBar.styleBlackTranslucent()
          } else {
            window.StatusBar.styleDefault()
          }
        }
      } else {
        // Rollback old or config value
        this.statusbarTextColor = oldColor !== null ? oldColor : this.config.statusbarTextColor
      }
    }
  },
  // Restore / set initial value
  created: function () {
    if (window.localStorage.statusbarTextColor !== undefined) {
      this.statusbarTextColor = window.localStorage.statusbarTextColor
    } else {
      this.statusbarTextColor = this.config.statusbarTextColor
    }
  }
}
mixins.manageStatusbarBackgroundColor = {
  // Set variable
  data: {
    statusbarBackgroundColor: null
  },
  // Handle change
  watch: {
    statusbarBackgroundColor: function (newColor, oldColor) {
      // Add missing hash sign
      if (/^[0-9a-f]{6}$/.test(newColor)) {
        newColor = '#' + newColor
      }
      // New color is valid
      if (/^#[0-9a-f]{6}$/.test(newColor)) {
        // Update local storage
        window.localStorage.statusbarBackgroundColor = newColor
        // Update DOM
        window.Dom7('.statusbar-overlay').css('background', newColor)
        // Update Cordova
        if (window.StatusBar) {
          window.StatusBar.backgroundColorByHexString(newColor)
        }
      } else {
        // Rollback old or config value
        this.statusbarBackgroundColor = oldColor !== null ? oldColor : this.config.statusbarBackgroundColor
      }
    }
  },
  // Restore / set initial value
  created: function () {
    if (window.localStorage.statusbarBackgroundColor !== undefined) {
      this.statusbarBackgroundColor = window.localStorage.statusbarBackgroundColor
    } else {
      this.statusbarBackgroundColor = this.config.statusbarBackgroundColor
    }
  }
}
mixins.preventOverscroll = {
  created: function () {
    // No native application (Overscroll disallowed by Cordova for native Apps)
    if (!window.cordova) {
      // Set overflow attribute to app container
      window.Dom7('#app').css('-webkit-overflow-scrolling', 'touch')
      // Definen start value
      var startY = 0
      // Remember touch start position
      window.Dom7(document).on('touchstart', evt => {
        startY = evt.touches ? evt.touches[0].screenY : evt.screenY
      })
      // Handle touch move
      window.Dom7(document).on('touchmove', evt => {
        // Get the element that was scrolled upon
        var el = evt.target
        // Check all parent elements for scrollability
        while (el !== document.body) {
          // Get some style properties
          var style = window.getComputedStyle(el)
          if (!style) {
          // If we've encountered an element we can't compute the style for, get out
            break
          }
          // Ignore range input element
          if (el.nodeName === 'INPUT' && el.getAttribute('type') === 'range') {
            return
          }
          // Ignore scrollable tabbar
          if (window.Dom7(el).hasClass('tabbar-scrollable')) {
            return
          }
          // Ignore horizontal timeline
          if (window.Dom7(el).hasClass('horizontal-timeline')) {
            return
          }
          // Determine scrolling property
          var scrolling = style.getPropertyValue('-webkit-overflow-scrolling')
          var overflowY = style.getPropertyValue('overflow-y')
          var height = parseInt(style.getPropertyValue('height'), 10)
          // Determine if the element should scroll
          var isScrollable = scrolling === 'touch' && (overflowY === 'auto' || overflowY === 'scroll')
          var canScroll = el.scrollHeight > el.offsetHeight
          if (isScrollable && canScroll) {
            // Get the current Y position of the touch
            var curY = evt.touches ? evt.touches[0].screenY : evt.screenY
            // Determine if the user is trying to scroll past the top or bottom
            // In this case, the window will bounce, so we have to prevent scrolling completely
            var isAtTop = (startY <= curY && el.scrollTop === 0)
            var isAtBottom = (startY >= curY && el.scrollHeight - el.scrollTop === height)
            // Stop a bounce bug when at the bottom or top of the scrollable element
            if (isAtTop || isAtBottom) {
              evt.preventDefault()
            }
            // No need to continue up the DOM, we've done our job
            return
          }
          // Test the next parent
          el = el.parentNode
        }
        // Stop the bouncing -- no parents are scrollable
        evt.preventDefault()
      })
    }
  }
}
mixins.manageState = {
  data: {
    stateReady: false
  },
  watch: {
    f7Ready: function () {
      const config = this.config
      function restoreState (callback) {
        restoreScrollOnPageLoad()
        restoreTabOnPageLoad()
        restoreFormInputOnPageLoad()
        restoreViews(function () {
          restoreOverlays(function () {
            window.Dom7('#frame').show()
            restoreFocus()
            setTimeout(() => {
              window.Dom7(window).trigger('resize')
            }, 0)
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
        if (config.restoreHistory === false && urls.length > 0) {
          urls = urls.slice(-1)
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
              if (element === 'panel' && window.Dom7('.panel-' + value).length > 0) {
                window.f7.openPanel(value === 'right' ? 'right' : 'left', false)
              } else if (element === 'actions' && window.Dom7('.actions-modal' + value).length > 0) {
                window.f7.openModal(value, false)
              } else if (element === 'loginscreen' && window.Dom7('.login-screen' + value).length > 0) {
                window.f7.loginScreen(value, false)
              } else if (element === 'picker' && window.Dom7('.picker-modal' + value).length > 0) {
                window.f7.pickerModal(value, false, false)
              } else if (element === 'popup' && window.Dom7('.popup' + value).length > 0) {
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
        window.Dom7(document).on('page:init page:reinit swipeback:beforechange', e => {
          // Get view
          let view = e.type === 'swipeback:beforechange' ? e.target.f7View : e.detail.page.view
          // Get urls
          let urls = view.history ? JSON.parse(JSON.stringify(view.history)) : []
          // Remove url on back navigation
          if (e.type !== 'page:init') urls.pop()
          // Filter temporary pages
          let urlsNew = []
          urls.map(url => {
            if (!/^\/?#content-/.test(url)) {
              if (url.substr(0, 1) === '/') url = url.substr(1)
              if (url.substr(url.length - 1) === '/') url = url.substr(0, url.length - 1)
              urlsNew.push(url)
            }
          })
          // Save new history
          window.localStorage['urls|' + view.selector] = JSON.stringify(urlsNew)
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
          if (id !== 'app-framework-login-popup') {
            let classes = e.target.className.split(' ')
            // Update local storage
            if (action === 'close') {
              window.localStorage.removeItem(type)
            } else if (type === 'panel') {
              window.localStorage.panel = classes.indexOf('panel-left') !== -1 ? 'left' : 'right'
            } else if (['popup', 'loginscreen', 'picker', 'actions'].indexOf(type) !== -1 && id !== '') {
              window.localStorage[type] = '#' + id
            }
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
               (el.length > 0 && el[0].classList.length > 0 ? '.' + el[0].classList.value.replace(/ /g, '.') : '')
      }
      function getViewUrl (el) {
        let viewSel = getViewSel(el)
        for (let v = 0; v < window.f7.views.length; v++) {
          if (window.f7.views[v].selector === viewSel) {
            let url = window.f7.views[v].url
            if (url.substr(0, 1) === '/') url = url.substr(1)
            if (url.substr(url.length - 1) === '/') url = url.substr(0, url.length - 1)
            return url
          }
        }
      }
      restoreState(() => {
        rememberState()
        setTimeout(() => {
          this.stateReady = true
        })
      })
    }
  }
}
mixins.languagePattern = {
  data: {
    languages: [],
    languagePattern: {}
  },
  created () {
    this.languages = process.env.LANGUAGES.split(',')
    this.languages.forEach((lang) => {
      this.languagePattern[lang] = require(process.env.APP_ROOT_FROM_SCRIPTS + 'lang/' + lang + '.json')
    })
  },
  methods: {
    getLanguagePattern (key, data) {
      const requestedText = this.languagePattern[this.language] ? this.languagePattern[this.language][key] : undefined
      const defaultText = this.languagePattern[this.config.defaultLanguage] ? this.languagePattern[this.config.defaultLanguage][key] : undefined
      let text = requestedText || defaultText || (data !== null ? '{{' + key + ', ' + JSON.stringify(data) + '}}' : '{{' + key + '}}')
      if (data !== null) {
        for (let item in data) {
          text = text.replace(new RegExp('\\{\\{' + item + '\\}\\}', 'g'), data[item])
        }
      }
      return text
    }
  }
}

function initF7VueApp () {
  // Load Vue
  let vue = require('vue/dist/vue.common.js')
  // Load Framework7
  require('../vendor/framework7/js/framework7.js')
  // Load Framework7-Vue (with workaround for theme integration)
  let config = require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  let theme = (/^(ios|material)$/.test(window.localStorage.theme) && config.theme.split('-').indexOf(window.localStorage.theme) >= 0)
    ? window.localStorage.theme : config.theme.split('-')[0]
  vue.use(require('../vendor/framework7-vue/framework7-vue.js'), {theme: theme})
  // Use login popup
  vue.component('login-popup', require('./login-popup.vue'))
  // Load app component
  let appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  // Load image-uploader component
  vue.component('image-uploader', require('./image-uploader.vue'))
  // Use global mixins
  vue.mixin(easierGlobalDataObject)
  vue.mixin(easierLanguagePattern)
  vue.mixin(easierFirebase)
  if (config.restoreComponentData) {
    vue.mixin(manageComponentData)
  }
  // Get local mixins as array
  let useMixins = Object.keys(mixins).map(mixin => mixins[mixin])
  // Load custom vue script
  vue = process.env.CUSTOM_VUE_SCRIPT === 'true' ? require(process.env.APP_ROOT_FROM_SCRIPTS + 'vue.js')(vue) : vue
  // Init Framework7-Vue application
  new vue({ // eslint-disable-line
    // Define root element
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    // Load local mixins
    mixins: useMixins,
    // Add Framework7
    framework7: config.framework7parameters,
    data: {
      f7Ready: false
    },
    methods: {
      onF7Init: function () {
        this.f7Ready = true
      }
    }
  })
}

window.initApplication = () => {
  initCordova(() => {
    initF7VueApp()
  })
}
