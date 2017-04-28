/* Purpose: Provide client code */

'use strict'

// Define global mixins
let globalMixins = {}

// Define local mixins
let localMixins = {}
localMixins.loadConfig = {
  data: {
    // Load App Framework information
    framework: require('../package.json'),
    // Load project information
    project: require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'package.json'),
    // Load application configuration
    config: require(process.env.APP_ROOT_FROM_SCRIPTS + 'config.json')
  },
  // Update Framework7 modal title
  created: function () {
    this.$options.framework7.modalTitle = this.config.title
  }
}
localMixins.loadRoutes = {
  created: function () {
    // Load routes file
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
    this.routes = routes
    // Add login screen route
    routes.push({
      path: '/app-framework-login-screen/',
      component: require('./login-screen.vue')
    })
    // Add routes to Framework7 initialization object
    this.$options.framework7.routes = routes
  }
}
localMixins.loadIconFonts = {
  created: function () {
    if (process.env.FONT_FRAMEWORK7 === 'true') require('framework7-icons/css/framework7-icons.css')
    if (process.env.FONT_MATERIAL === 'true') require('../vendor/material-icons/css/material-icons.css')
    if (process.env.FONT_ION === 'true') require('ionicons/dist/css/ionicons.css')
    if (process.env.FONT_AWESOME === 'true') require('font-awesome/css/font-awesome.css')
  }
}
localMixins.loadFavicon = {
  created: function () {
    require(process.env.CACHE_ROOT_FROM_SCRIPTS + 'icons/dev/favicon.ico')
  }
}
localMixins.manageLanguage = {
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
    this.language = window.localStorage.language
  }
}
localMixins.manageTheme = {
  // Set initial value
  data: {
    theme: null
  },
  // Watch for change
  watch: {
    theme: function (newTheme, oldTheme) {
      // New theme is valid
      if (/^(ios|material)$/.test(newTheme)) {
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
      // New theme is not valid
      } else {
        // Rollback old value or configuration
        this.theme = oldTheme !== null ? oldTheme : this.config.theme.split('-')[0]
      }
    }
  },
  // Restore local storage
  created: function () {
    this.theme = window.localStorage.theme
  }
}
localMixins.manageColor = {
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
localMixins.manageLayout = {
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

// Initialize Framework7-Vue application
function initF7VueApp () {
  // Load Vue
  let vue = require('vue/dist/vue.common.js')
  // Load Framework7
  require('../vendor/framework7/js/framework7.js')
  // Load Framework7-Vue
  vue.use(require('../vendor/framework7-vue/framework7-vue.js'))
  // Load app component
  let appComponent = require(process.env.APP_ROOT_FROM_SCRIPTS + 'app.vue')
  // Load global mixins
  for (let mixin in globalMixins) vue.mixin(globalMixins[mixin])
  // Get local mixins as array
  let mixins = Object.keys(localMixins).map(mixin => localMixins[mixin])
  // Init Framework7-Vue application
  new vue({ // eslint-disable-line
    // Define root element
    el: '#app',
    template: '<app />',
    components: {app: appComponent},
    // Load local mixins
    mixins: mixins,
    // Define initial Framework7 object
    framework7: {}
  })
}
initF7VueApp()
