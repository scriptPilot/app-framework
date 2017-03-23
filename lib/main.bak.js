/* eslint-disable */

/*

  Purpose:
  - Webpack entry point
  - Load all client-side modules
  - Init Framework7-Vue app
  - Handle phone frame
  - Handle state restoration for pages, modals and form focus

*/

'use strict'

// Shortlink to local storage
var localStorage = window.localStorage

// Reset local storage after App Framework version change
if (process.env.RESET_LOCAL_STORAGE === 'true' &&
    (!window.localStorage['app-framework-version'] || window.localStorage['app-framework-version'] !== process.env.FRAMEWORK_VERSION)) {
  let showMessage = window.localStorage['app-framework-version'] !== undefined
  for (let item in window.localStorage) {
    if (!/firebase:(.+)/.test(item) && item !== 'user') {
      window.localStorage.removeItem(item)
    }
  }
  window.localStorage['app-framework-version'] = process.env.FRAMEWORK_VERSION
  window.localStorage['showCacheResetAlert'] = showMessage
}

// Import mixin for page runtime management
Vue.mixin(require('./mixin-page.js'))

// Language patterns
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

// Init App
new Vue({ // eslint-disable-line
  el: '#app',
  template: '<app/>',
  data: {
    language: localStorage.language ? localStorage.language : cfg.defaultLanguage,
    title: cfg.title,
    theme: cfg.theme,
    version: cfg.version,
    packageVersion: process.env.FRAMEWORK_VERSION,
    config: cfg,
    user: null
  },
  computed: {
    text: function () {
      return text[this.language] ? text[this.language] : text['en']
    },
    isMobileDevice: function () {
      return this.$f7.device.ios !== false || this.$f7.device.android !== false
    },
    isNativeApp: function () {
      return window.cordova !== undefined
    },
    isHomescreenApp: function () {
      return window.cordova === undefined && (this.$f7.device.webView !== null || window.matchMedia('(display-mode: standalone)').matches)
    }
  },
  framework7: {
    root: '#app',
    routes: Routes,
    material: process.env.THEME === 'material',
    modalTitle: cfg.title,
    preroute: function (view, options) {
      let url = options.isBack ? view.history[view.history.length - (options.preloadOnly ? 1 : 2)] : options.url
      /* Consider dynamic content, e.g. smart selects */
      if (!url) {
        return true
      }
      let page = url.substr(0, url.indexOf('/') === -1 ? url.length : url.indexOf('/'))
      if (window.user || cfg.pagesWithRequiredLogin.indexOf(page) === -1) {
        return true
      } else {
        localStorage.requestedView = view.container.id
        localStorage.requestedUrl = url
        window.f7.loginScreen()
        return false
      }
    }
  },
  components: {
    app: require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  },
  mounted: function () {
    // Adjust web look to iPhone
    if (!this.isMobileDevice && cfg.showPhoneFrameOnDesktop === true) {
      this.$$('html').addClass('pixel-ratio-2')
      this.$$('html').addClass('ios-gt-8')
      this.$$('html').addClass('light-scrollbars')
    }

    // Update phone frame function
    var updatePhoneFrame = function () {
      // Show frame on desktop
      if (!this.isMobileDevice && cfg.showPhoneFrameOnDesktop === true) {
        // Show frame
        if (window.innerWidth > 370 && window.innerHeight > 778) {
          this.$$('#frame').addClass('phone')
          this.$$('#frame').removeClass('limitWidth')
          this.$$('#frame').removeClass('limitHeight')
          this.$$('body').removeClass('bodyDark')

            // Limit width and height
        } else if (window.innerWidth > 320 && window.innerHeight > 568) {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').addClass('limitWidth')
          this.$$('#frame').addClass('limitHeight')
          this.$$('body').addClass('bodyDark')

            // Limit width
        } else if (window.innerWidth > 320) {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').addClass('limitWidth')
          this.$$('#frame').removeClass('limitHeight')
          this.$$('body').addClass('bodyDark')

            // Limit height
        } else if (window.innerHeight > 568) {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').removeClass('limitWidth')
          this.$$('#frame').addClass('limitHeight')
          this.$$('body').addClass('bodyDark')

            // No limitation
        } else {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').removeClass('limitWidth')
          this.$$('#frame').removeClass('limitHeight')
          this.$$('body').removeClass('bodyDark')
        }
      }
    }.bind(this)

    // Resize initially
    updatePhoneFrame()

    // Resize again on windows resize
    this.$$(window).resize(updatePhoneFrame)

    // Define Firebase config
    let firebaseConfig = process.env.DEV_BUILD === 'true' && cfg['dev-firebase'].useDevFirebaseOnTesting === true ? cfg['dev-firebase'] : cfg.firebase

    // Firebase configuration not empty
    if (firebaseConfig.apiKey !== '' &&
        firebaseConfig.authDomain !== '' &&
        firebaseConfig.databaseURL !== '' &&
        firebaseConfig.storageBucket !== '') {
      // Import Firebase
      var firebase = window.firebase = require('firebase')

      // Init Firebase
      firebase.initializeApp(firebaseConfig)

      // User data from cache
      window.user = this.user = localStorage.user ? JSON.parse(localStorage.user) : null

      // Monitor user changes
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          window.user = this.user = {
            uid: user.uid,
            email: user.email
          }
          localStorage.user = JSON.stringify(window.user)
        } else {
          // After logout - browse back in history to last page series which does not require login
          if (localStorage.user) {
            // Loop views
            let viewsToReduce = window.views
            for (let v in viewsToReduce) {
              if (viewsToReduce[v]) {
                let openPageSeries = 0
                // Loop pages, count number of non-login-requiring pages
                for (let p = 0; p < viewsToReduce[v].pages.length; p++) {
                  if (cfg.pagesWithRequiredLogin.indexOf(viewsToReduce[v].pages[p]) === -1) {
                    openPageSeries += 1
                  }
                }
                // Get number of pages to browse back
                let browseBack = viewsToReduce[v].pages.length - openPageSeries
                // Browse back
                for (let b = 0; b < browseBack; b++) {
                  setTimeout(function () {
                    this.$f7.views[viewsToReduce[v].no].router.back({animatePages: false})
                  }.bind(this), 0)
                }
              }
            }
          }
          // After logout - remove all login requiring pages from local storage
          if (localStorage.user) {
            for (let el in localStorage) {
              if (/page:(.+)/.test(el)) {
                let page = el.substr(el.indexOf('/') + 1)
                page = page.substr(0, page.indexOf('/') === -1 ? page.length : page.indexOf('/'))
                if (cfg.pagesWithRequiredLogin.indexOf(page) !== -1) {
                  localStorage.removeItem(el)
                }
              }
            }
          }
          window.user = this.user = null
          localStorage.removeItem('user')
        }
      }.bind(this))

      // Database shortlink
      window.db = function (path) {
        return firebase.database().ref(path)
      }

      // Storage shortlink
      window.store = function (path) {
        return firebase.storage().ref(path)
      }

      // Timestamp
      window.timestamp = firebase.database.ServerValue.TIMESTAMP
    } else {
      window.user = null
      window.db = null
      window.store = null
      window.timestamp = null
    }

    // Sort object shortlink
    window.sortObject = require('./sort-object.js')

    // Update text patterns
    this.updateTextPatterns()


    // Remember popup
    this.$$(document).on('popup:opened popup:closed', function (ePopup) {
      if (ePopup.type === 'popup:opened') {
        localStorage.popup = this.$$(ePopup.target).attr('id')
      } else {
        localStorage.removeItem('popup')
      }
    }.bind(this))

    // Remember loginScreen
    this.$$(document).on('loginscreen:opened loginscreen:closed', function (eLoginScreen) {
      if (eLoginScreen.type === 'loginscreen:opened') {
        localStorage.loginScreen = this.$$(eLoginScreen.target).attr('id')
      } else {
        localStorage.removeItem('loginScreen')
      }
    }.bind(this))


    // Restore panel, popup, login screen, form focus
    setTimeout(function () {
      if (localStorage.panel) {
        this.$f7.openPanel(localStorage.panel, false)
      }
      if (localStorage.popup) {
        this.$f7.popup('#' + localStorage.popup, false, false)
      }
      if (localStorage.loginScreen) {
        this.$f7.loginScreen('#' + localStorage.loginScreen, false)
      }
      if (localStorage.formFocus) {
        setTimeout(function () {
          let elType = this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']')[0].tagName
          if (elType === 'INPUT') {
            let val = this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').val()
            this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').val('')
            this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').focus()
            this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').val(val)
          } else {
            this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').focus()
          }
        }.bind(this), 0)
      }
    }.bind(this), 0)

    // Show app
    setTimeout(function () {
      this.$$('.framework7-root').css('visibility', 'visible')

      // Show cache reset alert
      if (localStorage['showCacheResetAlert'] === 'true') {
        this.$f7.alert(this.text.cacheResetAlert, function () {
          localStorage.removeItem('showCacheResetAlert')
        })
      }
    }.bind(this))
  },
  methods: {
    updateTextPatterns: function () {
      let patterns = f7Text[this.language] ? f7Text[this.language] : f7Text['en']
      for (let p in patterns) {
        this.$f7.params[p] = patterns[p]
      }
    }
  },
  watch: {
    language: function (newLanguage) {
      localStorage.language = newLanguage
      this.updateTextPatterns()
    }
  }
})
