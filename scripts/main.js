// Load application configuration
var app = require(process.env.APP_ROOT_FROM_SCRIPTS + 'package.json')

// Import underscore
window['_'] = require('underscore')

// Import and initialize Firebase
if (process.env.USE_FIREBASE === 'true') {
  window.firebase = require('firebase')
  window.firebase.initializeApp({
    apiKey: app.firebase.apiKey,
    authDomain: app.firebase.authDomain,
    databaseURL: app.firebase.databaseURL,
    storageBucket: app.firebase.storageBucket,
    messagingSenderId: app.firebase.messagingSenderId
  })
  window.db = function (path) {
    return window.firebase.database().ref(path || '/')
  }
} else {
  window.firebase = null
}

// Import Vue
var Vue = require('vue')

// Import Framework7
require('framework7/dist/js/framework7.min.js')
if (process.env.THEME === 'material') {
  require('framework7/dist/css/framework7.material.min.css')
  require('framework7/dist/css/framework7.material.colors.min.css')
} else {
  require('framework7/dist/css/framework7.ios.min.css')
  require('framework7/dist/css/framework7.ios.colors.min.css')
}

// Init Framework7 Vue Plugin
Vue.use(require('framework7-vue'))

// Import icon fonts
if (process.env.FONT_FRAMEWORK7 === 'true') {
  require('../libs/framework7-icons/css/framework7-icons.css')
}
if (process.env.FONT_MATERIAL === 'true') {
  require('../libs/material-icons/css/material-icons.css')
}
if (process.env.FONT_ION === 'true') {
  require('../libs/ion-icons/css/ion-icons.css')
}
if (process.env.FONT_AWESOME === 'true') {
  require('../libs/fontAwesome-icons/css/fontAwesome-icons.css')
}

// Import iNoBounce
require('inobounce')

// Import main css
require('../main.css')

// Load routes
var Routes = []
for (var page in app.routes) {
  Routes.push({path: page, component: require(process.env.APP_ROOT_FROM_SCRIPTS + 'pages/' + app.routes[page] + '.vue')})
}

// Import sortObject function
require('./sortObject.js')

// Import mixin for page runtime management
Vue.mixin(require('./pageMixin.js'))

// Init App
var localStorage = window.localStorage
new Vue({ // eslint-disable-line
  el: '#app',
  template: '<app/>',
  data: {
    language: localStorage.language ? localStorage.language : app.defaultLanguage,
    title: app.title,
    version: app.version
  },
  framework7: {
    root: '#app',
    routes: Routes,
    material: process.env.THEME === 'material',
    preroute: function (view, options) {
      /*
      let url = !options.isBack ? options.url : views[(view.selector.indexOf('.') === -1 ? view.selector : view.selector.substr(1, view.selector.indexOf('.') - 1))][]

      let pageName = null
      if (!options.isBack) {
        pageName = options.url.indexOf('/') === -1 ? options.url : options.url.substr(0, options.url.indexOf('/'))
      } else {
        let viewId = view.selector.indexOf('.') === -1 ? view.selector : view.selector.substr(1, view.selector.indexOf('.') - 1)
        pageName = views[viewId]
      }

      let pageName = null
      if (!options.isBack) {

      }
      let views = localStorage.views ? JSON.parse(localStorage.views) : {}
      console.log(viewId, pageName, )
      */
      return true
    }
  },
  components: {
    app: require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  },
  mounted: function () {
    // Set phone frame

      // Update phone frame function
    var updatePhoneFrame = function () {
        // Show frame on desktop
      if (app.showFrameOnDesktop && !this.$f7.device.os) {
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

        // Don't show frame
      } else {
        this.$$('#frame').removeClass('phone')
        this.$$('#frame').removeClass('limitWidth')
        this.$$('#frame').removeClass('limitHeight')
        this.$$('body').removeClass('bodyDark')
      }

        // Resize navbars
      setTimeout(function () {
        let views = JSON.parse(localStorage.views)
        for (let view in views) {
          this.$f7.sizeNavbars('#' + view)
        }
      }.bind(this), 400)
    }.bind(this)

      // Resize initially
    updatePhoneFrame()

      // Resize again on windows resize
    this.$$(window).resize(updatePhoneFrame)

    // Remember panel
    this.$$(document).on('panel:opened panel:closed', function (ePanel) {
      if (ePanel.type === 'panel:opened') {
        localStorage.panel = /left/.test(ePanel.path[0]._prevClass) ? 'left' : 'right'
      } else {
        localStorage.removeItem('panel')
      }
    })

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

    // Remember form focus
    this.$$(document).on('focusin focusout', function (eFocus) {
      let focusId = this.$$(eFocus.target).attr('name')
      if (eFocus.type === 'focusin' && focusId !== null && focusId !== '') {
        localStorage.formFocus = focusId
      } else {
        localStorage.removeItem('formFocus')
      }
    }.bind(this))

    // Restore pages
    if (localStorage.views) {
      let views = JSON.parse(localStorage.views)
      localStorage.removeItem('views')
      this.$$('.view').each(function (viewNo, viewEl) {
        let viewId = this.$$(viewEl).attr('id')
        for (let pageNo in views[viewId]) {
          setTimeout(function () {
            this.$f7.views[viewNo].router.load({
              url: views[viewId][pageNo].url,
              animatePages: false
            })
          }.bind(this), 0)
        }
      }.bind(this))
    }

    // Restore panel, popup, login screen, form focus
    setTimeout(function () {
      if (localStorage.panel) {
        this.$f7.openPanel(localStorage.panel)
      }
      if (localStorage.popup) {
        this.$f7.popup('#' + localStorage.popup)
      }
      if (localStorage.loginScreen) {
        this.$f7.loginScreen('#' + localStorage.loginScreen)
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
    }.bind(this), 0)
  },
  watch: {
    language: function (newLanguage) {
      localStorage.language = newLanguage
    }
  }
})
