// Load project and app configuration
var app = require(process.env.ROOT_APP + 'package.json')
var project = require(process.env.ROOT_PROJECT + 'package.json')

// Import underscore
var _ = require('underscore')

// Import and initialize Firebase
if (process.env.USE_FIREBASE === 'true') {
  var firebase = window.firebase = require('firebase')
  firebase.initializeApp(app.firebase)
} else {
  window.firebase = null
}

// Import Vue
var Vue = require('vue')

// Import F7
require('framework7')

// Import F7 Vue Plugin
var Framework7Vue = require('framework7-vue')

// Import F7 iOS Theme Styles
if (process.env.THEME === 'material') {
  require('framework7/dist/css/framework7.material.min.css')
  require('framework7/dist/css/framework7.material.colors.min.css')
} else {
  require('framework7/dist/css/framework7.ios.min.css')
  require('framework7/dist/css/framework7.ios.colors.min.css')
}

// Icon fonts
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

// Import App Component
var App = require(process.env.ROOT_APP + 'app.vue')

// Init F7 Vue Plugin
Vue.use(Framework7Vue)

// Init App
var localStorage = window.localStorage
new Vue({
  el: '#app',
  template: '<app/>',
  data: {
    language: localStorage.language ? localStorage.language : app.defaultLanguage,
    title: app.title,
    version: project.version,
    runtime: localStorage.runtime ? JSON.parse(localStorage.runtime) : {}
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
    
    // runtime: {viewId: [{url, scrollPosition, formData, tabs: {tabId: scrollPosition}, activeTab}]}
    
    // List views
    let views = {}
    this.$$('.view').each(function (i, view) {
      let viewId = this.$$(view).attr('id')
      if (viewId !== null && viewId !== '' && !views[viewId]) {
        views[viewId] = []
      } else {
        console.error('Please assign a unique ID to each view component!')
      }
    }.bind(this))
    
    // Check runtime
    let runtimeCheck = true
    if (_.size(this.runtime) !== _.size(views)) {
      runtimeCheck = false
    } else {
      for (let view in views) {
        if (!this.runtime[view]) {
          runtimeCheck = false
        }
      }
    }
    
    // Create/Replace runtime
    if (runtimeCheck === false) {
      this.runtime = views
      this.saveRuntime()
    }
    
    // Remember pages, tabs, scroll positions
    this.$$(document).on('page:init page:reinit', function (ePage) {
      console.log(ePage.detail.page.from)
      let realPage = ePage.detail.page.url !== '#content-2' && ePage.detail.page.fromPage.url !== '#content-2'
      
      // Real page change
      if (realPage) {
        let view = this.$$(ePage.target).parents('.view').attr('id')
        
        // Forward - add page
        if (ePage.type === 'page:init') {
          let url = ePage.detail.page.url
          
          // Loop tabs
          let tabs = {}
          let activeTab = null
          this.$$(ePage.target).find('.tab.page-content').each(function(i, elTab) {
            let tabId = this.$$(elTab).attr('id')
            if (tabId !== null && tabId !== '' && tabs[tabId] === undefined) {
              tabs[tabId] = 0
            } else {
              consolePage.error('Please assign a unique ID to each tab component!')
            }
            if (this.$$(elTab).hasClass('active')) {
              activeTab = tabId
            }
          }.bind(this))
          tabs = _.size(tabs) > 0 ? tabs : null
          
          // Add page to runtime
          this.runtime[view].push({
            url: url,
            scrollPosition: 0,
            formData: null,
            tabs: tabs,
            activeTab: activeTab          
          })

          // Attach tab watcher
          if (tabs) {
            this.$$(ePage.target).on('tab:show', function (eTab) {
              this.runtime[view][pageNo - 1].activeTab = this.$$(eTab.target).attr('id')
              this.saveRuntime()
            }.bind(this))
          }
          
          // Attach scroll position watcher
          let pageNo = _.size(this.runtime[view])
          if (tabs) {
            this.$$(ePage.target).find('.page-content').on('scroll', function (ePageContent) {
              this.runtime[view][pageNo - 1].scrollPosition = ePageContent.target.scrollTop
              this.saveRuntime()
            }.bind(this))
          } else {
            for (let tab in tabs) {
              this.$$(ePage.target).find('.tab.page-content#' + tab).on('scroll', function (ePageContent) {
                this.runtime[view][pageNo - 1].tabs[tab] = ePageContent.target.scrollTop
                this.saveRuntime()
              }.bind(this))
            }
          }
          
          // Attach form data watcher
          // todo ...
          
        // Backward - remove page
        } else {
          this.runtime[view].pop()          
        }   
      }        
      this.saveRuntime()
    }.bind(this))
    
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
    
    
    /*
    
    // Update runtime: form data
    this.$$(document).on('keyup change', function (e) {
      let view = this.$$(e.target).parents('.view').attr('id')
      let page = this.$$(e.target).parents('.page')
      let data = []
      this.$$(e.target).parents('.page').find('form').each(function (i, el) {
        data.push(this.$f7.formToData(el))
      }.bind(this))
      this.runtime[view][this.runtime[view].length-1].formData = data
      this.saveRuntime()
    }.bind(this))
    
    // Remember form focus
    this.$$(document).on('focusout', function(e) {
      localStorage.removeItem('formFocus')
    })
    this.$$(document).on('focusin', function(e) {
      if (e.srcElement.name !== '') {
        localStorage.formFocus = e.srcElement.name
      }
    })
    
    // Remember panel/popup/loginscreen
    

    // Restore runtime: pages, form data, tabs, scroll positions
    if (runtimeCheck) {
      
      // Make snapshot of initial runtime
      let initialRuntime = JSON.parse(JSON.stringify(this.runtime))
    
      // Loop views
      for (let v in this.$f7.views) {        
        let viewId = Object.keys(initialRuntime)[v]
        let view = initialRuntime[viewId]
        if (view) {
          
          // Reset runtime to avoid double listing of pages
          this.runtime[viewId] = []
          
          // Loop pages          
          for (let p = 0; p < view.length; p++) {            
            let page = view[p]
            
            // Restore page
            setTimeout(function () {
              this.$f7.views[v].router.load({url: page.url, animatePages: false})              
            }.bind(this), 0)
            
          }
        
          // Restore form data, tabs, scroll positions
          setTimeout(function () {
            
            // Loop pages
            for (let p = 0; p < view.length; p++) {
              
              // Scroll position
              if (view[p].scrollPosition !== 0) {                
                this.$$(this.$$('.view#' + viewId + ' .page')[p]).find('.page-content').scrollTop(view[p].scrollPosition)
                this.runtime[viewId][p].scrollPosition = view[p].scrollPosition
              }   
              
            }
            
            // Save runtime
            this.saveRuntime()
            
          }.bind(this), 50)
          
        }
        
      }
      
    }
    
    // Restore form focus
    if (localStorage.formFocus) {
      setTimeout(function () {        
        this.$$('input[name=' + localStorage.formFocus + ']')[0].focus()
      }.bind(this), 100)
    }
    
    // Restore panel, popup, loginscreen
    if (localStorage.panel) {
      setTimeout(function () {
        this.$f7.openPanel(localStorage.panel)
      }.bind(this), 0)
    }
    if (localStorage.popup) {
      setTimeout(function () {
        this.$f7.popup('#' + localStorage.popup)
      }.bind(this), 0)
    }
    if (localStorage.loginscreen) {
      setTimeout(function () {
        this.$f7.loginScreen('#' + localStorage.loginscreen)
      }.bind(this), 0)
    }
  
  
    
    // Show app
    setTimeout(function () {
      this.$$('.framework7-root').css('visibility', 'visible')
    }.bind(this), 0)
    
    */
    
  },
  methods: {
    saveRuntime: function() {
      localStorage.runtime = JSON.stringify(this.runtime)
      console.log(JSON.stringify(JSON.parse(localStorage.runtime)['main-view']))
    }
  },
  watch: {
    language: function (newLanguage) {
      localStorage.language = newLanguage
    }
  }  
})
