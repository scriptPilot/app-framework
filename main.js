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
require('./libs/framework7/js/framework7.min.js')

// Import F7 Vue Plugin
var Framework7Vue = require('./libs/framework7-vue.min.js')

// Import F7 iOS Theme Styles
if (process.env.THEME === 'material') {
  require('./libs/framework7/css/framework7.material.min.css')
  require('./libs/framework7/css/framework7.material.colors.min.css')
} else {
  require('./libs/framework7/css/framework7.ios.min.css')
  require('./libs/framework7/css/framework7.ios.colors.min.css')
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
    // Runtime {viewId: [{url, scrollPosition, tabs: {tabId: scrollPosition}, activeTab}]}
    runtime: localStorage.runtime ? JSON.parse(localStorage.runtime) : {}/*,
    db: {}, // reserved for firebase data
    dbRef: {} // reserved for firebase refs     */
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
    
    /*
    // Update db with cached data, create ref and attach listener
    _.map(app.firebaseRefs, function (name, path) {      
      this.db[name] = localStorage['db_' + name] ? JSON.parse(localStorage['db_' + name]) : null
      this.dbRef[name] = firebase.database().ref(path)
      if (path.indexOf('$uid') === -1) {
        this.dbRef[name].on('value', function (snapshot) {
          this.db[name] = snapshot.val()
          console.log(this.db)
        }.bind(this))
      }
    }.bind(this))
    */
    
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
      
      // Get view
      let view = this.$$(ePage.target).parents('.view').attr('id')
      
      // Filter improper page changes
        let realPage = true
        
        // Smart selects
        if (ePage.detail.page.url === '#content-2' || (ePage.detail.page.fromPage && ePage.detail.page.fromPage.url === '#content-2')) {
          realPage = false
          
        // Display of popups and login screens
        } else if (this.runtime[view].length > 0 && ePage.detail.page.from === 'center') {
          realPage = false
        }
      
      // Real page change
      if (realPage) {
        
        // Forward - add page
        if (ePage.type === 'page:init') {
          let url = ePage.detail.page.url
          let pageNo = _.size(this.runtime[view])
          
          // Loop tabs
          let tabs = {}
          let activeTab = null
          this.$$(ePage.target).find('.tab.page-content').each(function(i, elTab) {
            let tabId = this.$$(elTab).attr('id')
            if (tabId !== null && tabId !== '' && tabs[tabId] === undefined) {
              tabs[tabId] = 0
            } else {
              console.error('Please assign a unique "id" attribute to each tab component on page "' + url + '"!')
            }
            if (this.$$(elTab).hasClass('active')) {
              activeTab = tabId
            }
          }.bind(this))
          tabs = _.size(tabs) > 0 ? tabs : null
          
          // Add page to runtime
          this.runtime[view].push({
            url: url,
            scrollPosition: 0,/*
            formData: null,*/
            tabs: tabs,
            activeTab: activeTab          
          })

          // Attach tab watcher
          if (tabs) {
            this.$$(ePage.target).on('tab:show', function (eTab) {
              this.runtime[view][pageNo].activeTab = this.$$(eTab.target).attr('id')
              this.saveRuntime()
            }.bind(this))
          }
          
          // Attach scroll position watcher
          if (!tabs) {
            this.$$(ePage.target).find('.page-content').on('scroll', function (ePageContent) {
              this.runtime[view][pageNo].scrollPosition = ePageContent.target.scrollTop
              this.saveRuntime()
            }.bind(this))
          } else {
            for (let tab in tabs) {
              this.$$(ePage.target).find('.tab.page-content#' + tab).on('scroll', function (ePageContent) {
                this.runtime[view][pageNo].tabs[tab] = ePageContent.target.scrollTop
                this.saveRuntime()
              }.bind(this))
            }
          }
          
          /*
          // Attach form data watcher
          let fields = []
          let fieldCheck = true
          this.$$(ePage.target).find(['input', 'select', 'textarea']).each(function (fieldNo, fieldEl) {
            let fieldName = this.$$(fieldEl).attr('name')
            let fieldType = this.$$(fieldEl).attr('type')
            if (fieldName !== '' && fieldName !== null && fieldName !== undefined
                && (fields.indexOf(fieldName) === -1 || fieldType === 'checkbox' || fieldType === 'radio')) {
              fields.push(fieldName)              
            } else {
              fieldCheck = false
            }
          }.bind(this))
          if (fieldCheck) {
            this.$$(ePage.target).on('keyup change', function (eField) {
              this.runtime[view][pageNo].formData = this.$f7.formToData(ePage.target)
              this.saveRuntime()
            }.bind(this))
          } else {
            console.error('Please assign a unique "name" attribute to each form field on page "' + url + '"!')
          }
          */
          
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
    
    // Restore pages, tabs, scroll positions, form data      
      _.map(this.runtime, function (pages, viewId) {
        this.runtime[viewId] = []
        this.saveRuntime()
        _.map(pages, function (page, pageNo) {
          setTimeout(function () {
            this.$f7.views[Object.keys(views).indexOf(viewId)].router.load({url: page.url, animatePages: false})
            setTimeout(function () {
              if (page.activeTab) {                
                this.$f7.showTab('#' + page.activeTab)                
                _.map(page.tabs, function (scrollPosition, tabId) {
                  this.$$(this.$$('.view#' + viewId + ' .page')[pageNo]).find('.tab.page-content#' + tabId).scrollTop(scrollPosition)
                }.bind(this))
              } else {
                if (page.scrollPosition > 0) {
                  this.$$(this.$$('.view#' + viewId + ' .page')[pageNo]).find('.page-content').scrollTop(page.scrollPosition)
                }
              } 
              /*
              if (page.formData) {
                this.$f7.formFromData(this.$$(this.$$('.view#' + viewId + ' .page')[pageNo]), page.formData)
                this.runtime[viewId][pageNo].formData = page.formData
              }
              */
              this.saveRuntime()
            }.bind(this), 0)
          }.bind(this), 0)
        }.bind(this))
      }.bind(this)) 
    
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
          this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').focus()
        }.bind(this), 200)
      }
    }.bind(this), 0)   
      
    // Show app
    setTimeout(function () {
      this.$$('.framework7-root').css('visibility', 'visible')
    }.bind(this), 0)
    
  },
  methods: {
    saveRuntime: function() {
      localStorage.runtime = JSON.stringify(this.runtime)
    }
  },
  watch: {
    language: function (newLanguage) {
      localStorage.language = newLanguage
    }
  }  
})
