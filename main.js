// Load project and app configuration
var app = require(process.env.ROOT_APP + 'package.json')
var project = require(process.env.ROOT_PROJECT + 'package.json')

// Import underscore
window['_'] = require('underscore')

// Import and initialize Firebase
if (process.env.USE_FIREBASE === 'true') {
  var firebase = window.firebase = require('firebase')
  firebase.initializeApp(app.firebase)
} else {
  window.firebase = null
}

// Import Vue
var Vue = require('vue')

// Import Framework7
require('./libs/framework7/js/framework7.min.js')
if (process.env.THEME === 'material') {
  require('./libs/framework7/css/framework7.material.min.css')
  require('./libs/framework7/css/framework7.material.colors.min.css')
} else {
  require('./libs/framework7/css/framework7.ios.min.css')
  require('./libs/framework7/css/framework7.ios.colors.min.css')
}

// Init Framework7 Vue Plugin
var Framework7Vue = require('framework7-vue')
Vue.use(Framework7Vue)

// Import icon fonts
if (process.env.FONT_FRAMEWORK7 === 'true') {
  require('./libs/framework7-icons/css/framework7-icons.css')
}
if (process.env.FONT_MATERIAL === 'true') {
  require('./libs/material-icons/css/material-icons.css')
}
if (process.env.FONT_ION === 'true') {
  require('./libs/ion-icons/css/ion-icons.css')
}
if (process.env.FONT_AWESOME === 'true') {
  require('./libs/fontAwesome-icons/css/fontAwesome-icons.css')
}

// Import iNoBounce
require('inobounce')

// Import main css
require('./main.css')

// Load routes
var Routes = []
for (var page in app.routes) {
  Routes.push({path: page, component: require(process.env.ROOT_APP + 'pages/' + app.routes[page] + '.vue')})
}

// Import app Component
var App = require(process.env.ROOT_APP + 'app.vue')

// Function to sort object by attribute
window.sortObject = function (obj, sortBy, sortDesc) {
  let arr = []
  for (let el in obj) {
    arr.push({
      '.key': el,
      '.sort': obj[el][sortBy] ? obj[el][sortBy] : ''
    })
  }
  arr.sort(function (a, b) {
    let result = null
    if (a['.sort'] === b['.sort'] === '') {
      result = 0
    } else if (a['.sort'] === '') {
      result = -1
    } else if (b['.sort'] === '') {
      result = 1
    } else {
      result = a['.sort'] - b['.sort']
    }
    result = sortDesc === true ? -1 * result : result
    return result
  })
  let sortedObj = {}
  for (let e = 0; e < arr.length; e++) {
    sortedObj[arr[e]['.key']] = obj[arr[e]['.key']]      
  }
  return sortedObj
}

// Mixin for local storage handling of page objects
Vue.mixin({
  
  // Define page runtime data
  data: function () {
    return {
      'runtimeView': null,
      'runtimePageNo': null,
      'runtimeUrl': null,      
      'runtimePageId': null,
      'runtimeTabs': null,
      'runtimeActiveTab': null,
      'runtimeScrollPosition': 0
    }
  },
  
  // Method to save page data to local storage
  methods: {
    saveRuntime: function () {
      if (this.runtimePageId) {
        let data = {}
        for (let el in this.$data) {
          data[el] = this.$data[el]
        }
        localStorage[this.runtimePageId] = JSON.stringify(data)
      }
    }
  },
  
  // Get runtime page data and attach event listener
  mounted: function () {    
  
    // Page with Framework7 route object
    if (this.$route) {  

      // Get views from local storage
      let views = localStorage.views ? JSON.parse(localStorage.views) : {}      
      
      // Get view
      this.runtimeView = this.$$(this.$el).parents('.view').attr('id')
      
      // Get page number
      if (!views[this.runtimeView]) {
        views[this.runtimeView] = []
      }
      this.runtimePageNo = views[this.runtimeView].length
      
      // Get url
      this.runtimeUrl = this.$route.url
      
      // Get page id
      this.runtimePageId = 'runtime/' + this.runtimeView + '/' + this.runtimePageNo + '/' + this.runtimeUrl
      
      // Copy initial runtime
      let initialRuntime = localStorage[this.runtimePageId] ? JSON.parse(localStorage[this.runtimePageId]) : null
      
      // Update views
      views[this.runtimeView].push({
        url: this.runtimeUrl,
        pageId: this.runtimePageId
      })
      localStorage.views = JSON.stringify(views)
      
      // Loop tabs
      this.$$(this.$el).find('.tab.page-content').each(function(i, elTab) {
        if (!this.runtimeTabs) {
          this.runtimeTabs = {}
        }
        let tabId = this.$$(elTab).attr('id')
        if (tabId !== null && tabId !== '' && this.runtimeTabs[tabId] === undefined) {
          this.runtimeTabs[tabId] = 0
        } else {
          console.error('Please assign a unique "id" attribute to each tab component on page "' + this.runtimeUrl + '"!')
        }
        if (this.$$(elTab).hasClass('active')) {
          this.runtimeActiveTab = tabId
        }
      }.bind(this))
      
      // Attach tab listener
      if (this.runtimeTabs) {
        this.$$(this.$el).on('tab:show', function (eTab) {
          this.runtimeActiveTab = this.$$(eTab.target).attr('id')
          this.saveRuntime()
        }.bind(this))
      }
      
      // Attach scroll position listener
      if (!this.runtimeTabs) {
        this.$$(this.$el).find('.page-content').on('scroll', function (ePageContent) {
          this.runtimeScrollPosition = ePageContent.target.scrollTop
          this.saveRuntime()
        }.bind(this))
      } else {
        for (let tab in this.runtimeTabs) {
          this.$$(this.$el).find('.tab.page-content#' + tab).on('scroll', function (ePageContent) {
            this.runtimeTabs[tab] = ePageContent.target.scrollTop
            this.saveRuntime()
          }.bind(this))
        }
      }
      
      // Restore initial runtime      
      if (initialRuntime) {
        
        // Data
        for (let el in initialRuntime) {
          if (!/^runtime(.*)/.test(el)) {
            this.$data[el] = initialRuntime[el]
          }
        }
        
        // Tabs, scroll position
        if (initialRuntime.runtimeTabs) {
          setTimeout(function () {
            this.$f7.showTab('.tab#' + initialRuntime.runtimeActiveTab)
          }.bind(this), 0)
          for (let tab in initialRuntime.runtimeTabs) {
            setTimeout(function () {
              this.$$(this.$el).find('.tab#' + tab).scrollTop(initialRuntime.runtimeTabs[tab])
            }.bind(this), 0)
          }
        } else {
          this.$$(this.$el).find('.page-content').scrollTop(initialRuntime.runtimeScrollPosition)
        }
        
      }
      
      // Save page in local storage
      this.saveRuntime()      
      
    } 
    
  },
  
  // Update runtime on Dom update
  beforeUpdate: function () {
    this.saveRuntime()
  },
  
  // Remove page from views and local storage on destroy
  beforeDestroy: function () {
    if (this.runtimePageId) {
      let views = localStorage.views ? JSON.parse(localStorage.views) : {}      
      views[this.runtimeView].splice(this.runtimePageNo, 1)      
      localStorage.views = JSON.stringify(views)
      localStorage.removeItem(this.runtimePageId)      
    }
  }
  
})

// Init App
var localStorage = window.localStorage
new Vue({
  el: '#app',
  template: '<app/>',
  data: {
    language: localStorage.language ? localStorage.language : app.defaultLanguage,
    title: app.title,
    version: project.version
  },  
  framework7: {
    root: '#app',
    routes: Routes,
    material: process.env.THEME === 'material'
  },
  components: {
    app: App
  },
  mounted: function () {
    
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
