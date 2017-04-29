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
localMixins.loadFixes = {
  create: function () {
    // Style fixes
    require('./fixes.css')
  }
}
localMixins.initCordova = {
  data: {
    deviceReady: false
  },
  created: function () {
    if (window.cordova !== undefined) {
      if (window.StatusBar !== undefined) {
        this.deviceReady = true
      } else {
        window.Dom7(document).on('deviceready', () => {
          this.deviceReady = true
        })
      }
    }
  }
}
localMixins.appMode = {
  data: {
    appMode: null
  },
  watch: {
    f7Ready: function () {
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
localMixins.addMissingStatusbar = {
  mounted: function () {
    if (window.Dom7('#app .statusbar-overlay').length < 1) {
      window.Dom7('#app').prepend('<div class="statusbar-overlay"></div>')
    }
  }
}
localMixins.tranformSubnavbarForMaterial = {
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
      if (/^(ios|material)$/.test(newTheme) && this.config.theme.split('-').indexOf(newTheme) >= 0) {
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
        // Update status bar background color accordingly
        if (this.config.changeStatusbarBackgroundColorOnThemeColorChange === true) {
          this.statusbarTextColor = newColor === 'white' ? 'black' : 'white'
          this.statusbarBackgroundColor = newColor === 'white' && window.cordova === undefined ? '000000' : this.colors[this.theme][newColor]
        }
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
localMixins.manageStatusbarVisibility = {
  // Set initial value
  data: {
    statusbarVisibility: null
  },
  watch: {
    // Watch for change
    statusbarVisibility: function (newState, oldState) {
      if (newState === true || newState === false) {
        // Update local storage
        window.localStorage.statusbarVisibility = newState
        // Update cordova
        if (this.deviceReady) {
          if (newState === true) {
            window.StatusBar.show()
          } else {
            window.StatusBar.hide()
          }
        }
        // Update DOM
        if (this.f7Ready) {
          if (newState === true && window.f7.device.statusBar === true) {
            window.Dom7('html').addClass('with-statusbar-overlay')
          } else if (this.appMode === 'native') {
            window.Dom7('html').removeClass('with-statusbar-overlay')
          }
        }
      } else {
        // Rollback old or config value
        this.statusbarVisibility = oldState !== null ? oldState : this.config.statusbarVisibility
      }
    },
    // Update Cordova initially
    deviceReady: function () {
      if (this.statusbarVisibility === true) {
        window.StatusBar.show()
      } else if (this.statusbarVisibility === false) {
        window.StatusBar.hide()
      }
    },
    // Update DOM initially
    f7Ready: function () {
      if (this.statusbarVisibility === true && window.f7.device.statusBar === true) {
        window.Dom7('html').addClass('with-statusbar-overlay')
      } else if (this.appMode === 'native') {
        window.Dom7('html').removeClass('with-statusbar-overlay')
      }
    }
  },
  // Restore local storage
  created: function () {
    this.statusbarVisibility = JSON.parse(window.localStorage.statusbarVisibility)
  }
}
localMixins.manageStatusbarTextColor = {
  // Set initial value
  data: {
    statusbarTextColor: null
  },
  watch: {
    // Watch for change
    statusbarTextColor: function (newColor, oldColor) {
      if (newColor === 'black' || newColor === 'white') {
        // Update local storage
        window.localStorage.statusbarTextColor = newColor
        // Update cordova
        if (this.deviceReady) {
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
    },
    // Update Cordova initially
    deviceReady: function () {
      if (this.statusbarTextColor === 'white') {
        window.StatusBar.styleBlackTranslucent()
      } else {
        window.StatusBar.styleDefault()
      }
    }
  },
  // Restore local storage
  created: function () {
    this.statusbarTextColor = window.localStorage.statusbarTextColor
  }
}
localMixins.manageStatusbarBackgroundColor = {
  // Initial state
  data: {
    statusbarBackgroundColor: null
  },
  watch: {
    // Watch for change
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
      } else {
        // Rollback old or config value
        this.statusbarBackgroundColor = oldColor !== null ? oldColor : this.config.statusbarBackgroundColor
      }
    }
  },
  // Restore local storage
  created: function () {
    this.statusbarBackgroundColor = window.localStorage.statusbarBackgroundColor
  },
  // Update DOM initially
  mounted: function () {
    if (this.statusbarBackgroundColor !== null) {
      window.Dom7('.statusbar-overlay').css('background', this.statusbarBackgroundColor)
    }
  }
}
localMixins.manageState = {
  data: {
    stateReady: false
  },
  watch: {
    f7Ready: function () {
      function restoreState (callback) {
        restoreScrollOnPageLoad()
        restoreTabOnPageLoad()
        restoreFormInputOnPageLoad()
        restoreViews(function () {
          restoreOverlays(function () {
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
      })
    }
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
    // Add Framework7
    framework7: {},
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
initF7VueApp()
