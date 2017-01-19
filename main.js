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
    
    /* runtime
    
      {
        'view1': [
          {
            url: ...,
            main: {
              scrollPosition: ...,
              formData: ...
            },
            activeTab: ...,
            tabs: {
              'tab1': {
                scrollPosition: ...,
                formData: ...
              },
              'tab2': { ... }
            }
          }
        ],
        'view2': [ ... ]
      }
    
    */
    
    // Check runtime
    let runtimeCheck = true
    if (_.size(this.runtime) !== this.$f7.views.length) {
      runtimeCheck = false
    } else {
      for (let v = 0; v < this.$f7.views.length; v++) {
        if (Object.keys(this.runtime)[v] !== this.$f7.views[v].selector) {
          runtimeCheck = false
        }
      }
    }
    
    // Create/replace runtime
    if (!runtimeCheck) {
      setTimeout(function () {
        this.runtime = {}
        
        // Loop views
        for (let v = 0; v < this.$f7.views.length; v++) { 
          let tabs = {}
          let activeTab = null
          this.$$(this.$f7.views[v].container).find('.page-on-center .tab').each(function(id, tab) {
            tab = this.$$(tab)
            if (tab.hasClass('active')) {
              activeTab = tab.attr('id')
            }
            tabs[tab.attr('id')] = {
              scrollPosition: 0,
              formFocus: null,
              formData: null
            }
          }.bind(this))
          this.runtime[this.$f7.views[v].selector] = [{
            url: this.$f7.views[v].history[0],
            scrollPosition: 0,
            formData: null,
            activeTab: activeTab,
            tabs: _.size(tabs) > 0 ? tabs : null
          }]
        }        
        
        this.saveRuntime()
      }.bind(this), 0)
    }
    
    // Update runtime: pages
    this.$$(document).on('page:afteranimation', function (e) { 
    
      // Do not consider smart selects
      if (e.detail.page.url !== '#content-2' && e.detail.page.fromPage.url !== '#content-2') {
        setTimeout(function () { 
        
          // Forward (add page)
          if (e.detail.page.from === 'right') {
            let tabs = {}
            let activeTab = null
            this.$$(e.detail.page.view.selector + ' .page-on-center').find('.page-on-center .tab').each(function(id, tab) {
              tab = this.$$(tab)
              if (tab.hasClass('active')) {
                activeTab = tab.attr('id')
              }
              tabs[tab.attr('id')] = {
                scrollPosition: 0,
                formData: null
              }
            }.bind(this))
            this.runtime[e.detail.page.view.selector].push({
              url: e.detail.page.url,
              scrollPosition: 0,
              formData: null,
              activeTab: activeTab,
              tabs: _.size(tabs) > 0 ? tabs : null
            })
            
          // Backward (remove page)
          } else {
            if (this.runtime[e.detail.page.view.selector].length > 0) {
              this.runtime[e.detail.page.view.selector].splice(this.runtime[e.detail.page.view.selector].length - 2, 1)
            }
          }
          
          this.saveRuntime()    
        }.bind(this), 0)          
      }
      
    }.bind(this))
    
    // Update runtime: tabs
    this.$$(document).on('tab:show', function(e) {
      this.runtime[this.$f7.getCurrentView().selector][this.runtime[this.$f7.getCurrentView().selector].length-1].activeTab = e.srcElement.id
      this.saveRuntime()
    }.bind(this))
    
    // Remember form focus
    this.$$(document).on('focusout', function(e) {
      localStorage.removeItem('formFocus')
    })
    this.$$(document).on('focusin', function(e) {
      localStorage.formFocus = e.srcElement.outerHTML
    })
    
    // Remember scroll position
    this.$$(document).on('page:afteranimation tab:show', function (e) { 
      setTimeout(function() {
        let view    = this.$f7.getCurrentView().selector
        let page    = '.page-on-center'
        let tab     = this.runtime[view][this.runtime[view].length-1].activeTab
        let content = tab ? '.tab#' + tab : '.page-content'
        let path    = view + ' ' + page + ' ' + content
        this.$$(path).on('scroll', function (e) {
          if (tab) {
            this.runtime[view][this.runtime[view].length-1].tabs[tab].scrollPosition = e.target.scrollTop
          } else {
            this.runtime[view][this.runtime[view].length-1].scrollPosition = e.target.scrollTop
          }
          this.saveRuntime()
        }.bind(this))                
      }.bind(this), 0)
    }.bind(this))
    
    /*
    
    
    // Restore runtime
    
      // Loop views      
      var views = Object.keys(this.runtime)
      for (let v = 0; v < views.length; v++) {
      
        // Loop pages
        for (let p = 0; p < this.runtime[views[v]].length; p++) {
          
          // Open url
          setTimeout(function () {
            this.$f7.views[v].router.load({url: this.runtime[v][p].url, animatePages: false})
          }.bind(this), 0)
          
        }
      
      }
      
    */
    
    // Remember panel/popup/loginscreen
    this.$$(document).on('panel:opened', function (e) {
      localStorage.panel = /left/.test(e.path[0]._prevClass) ? 'left' : 'right'
    })
    this.$$(document).on('panel:closed', function (e) {
      localStorage.removeItem('panel')
    })
    this.$$(document).on('popup:opened', function (e) {
      localStorage.popup = e.srcElement.id
    })
    this.$$(document).on('popup:closed', function (e) {
      localStorage.removeItem('popup')
    })
    this.$$(document).on('loginscreen:opened', function (e) {
      localStorage.loginscreen = e.srcElement.id
    })
    this.$$(document).on('loginscreen:closed', function (e) {
      localStorage.removeItem('loginscreen')
    })

    // Restore panel/popup/loginscreen
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
    
  },
  methods: {
    saveRuntime: function() {
      localStorage.runtime = JSON.stringify(this.runtime)
      console.log(JSON.parse(localStorage.runtime))
    }
  },
  watch: {
    language: function (newLanguage) {
      localStorage.language = newLanguage
    }
  }  
})
