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
    runtime: localStorage.runtime ? JSON.parse(localStorage.runtime) : [] // {viewSelector: [{url, tab, panel, loginScreen, scrollPosition}]}
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
    
    // Remember pages per view, scroll position per tab, 
    
    /*
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
      this.runtime = {}
      for (let v = 0; v < this.$f7.views.length; v++) { 
        this.runtime[this.$f7.views[v].selector] = [{
        url: this.$f7.views[v].history[0],
          tab: null,
          panel: null,
          popup: null,
          loginScreen: null,
          scrollPosition: 0
        }]
      }
      this.saveRuntime()
    }
    
    // Update runtime:pages
    this.$$(document).on('page:afteranimation', function (e) { 
    
      // Do not consider smart selects
      if (e.detail.page.url !== '#content-2' && e.detail.page.fromPage.url !== '#content-2') {
        
        // Forward (add page)
        if (e.detail.page.from === 'right') {
          this.runtime[e.detail.page.view.selector].push({
            url: e.detail.page.url,
            tab: null,
            panel: null,
            popup: null,
            loginScreen: null,
            scrollPosition: 0
          })
          
        // Backward (remove page)
        } else {
          if (this.runtime[e.detail.page.view.selector].length > 0) {
            this.runtime[e.detail.page.view.selector].splice(this.runtime[e.detail.page.view.selector].length - 2, 1)
          }
        }
        
        this.saveRuntime()        
      }
      
    }.bind(this))
    
    // Update runtime:tab
    this.$$(document).on('tab:show', function(e) {
      this.runtime[this.$f7.getCurrentView().selector][this.runtime[this.$f7.getCurrentView().selector].length-1].tab = '#'+e.srcElement.id
      this.saveRuntime()
    }.bind(this))
    
    // Update runtime:panel
    this.$$(document).on('panel:opened panel:closed', function(e) {      
    console.
      this.runtime[this.$f7.getCurrentView().selector][this.runtime[this.$f7.getCurrentView().selector].length-1].panel = e.type === 'panel:opened' ? (/left/.test(e.path[0]._prevClass) ? 'left' : 'right') : null
      this.saveRuntime()
    }.bind(this))
    
    
    
      
    // Update pages
    this.$$(document).on('page:afteranimation', function (e) {
    
      // Do not consider smart selects
      if (e.detail.page.url !== '#content-2' && e.detail.page.fromPage.url !== '#content-2') {
    
        let runtimeView = this.runtime[e.detail.page.view.selector]
        
        // Forward (add page)
        if (e.detail.page.from === 'right') {
          runtimeView.push({
            url: e.detail.page.url,
            tab: false,
            panel: false,
            popup: false,
            loginScreen: false,
            scrollPosition: 0
          })
          
        // Backward (remove page)
        } else {
          if (runtimeView.length > 0) {
            runtimeView.splice(runtimeView.length - 2, 1)
          }
        }
        
        // Update runtime on local storage
        this.updateRuntime()
        
      }
    }.bind(this))
    
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
    
    
    // ---
  
    /*
    // Remember histories
    this.$$(document).on('page:afteranimation', function (e) {
      setTimeout(function () {
        let histories = []
        for (let v = 0; v < this.$f7.views.length; v++) {
          let history = []
          for (let h = 0; h < this.$f7.views[v].history.length; h++) {
            if (this.$f7.views[v].history[h].substr(0, 1) !== '#') {
              history.push(this.$f7.views[v].history[h])
            }
          }
          histories.push(history)
        }
        localStorage.histories = JSON.stringify(histories)
      }.bind(this), 0)
    }.bind(this))

    // Restore histories
    if (localStorage.histories) {
      let histories = JSON.parse(localStorage.histories)
      if (histories.length === this.$f7.views.length) {
        for (let v = 0; v < histories.length; v++) {
          for (let h = 0; h < histories[v].length; h++) {
            setTimeout(function () {
              this.$f7.views[v].router.load({url: histories[v][h], animatePages: false})
            }.bind(this), 0)
          }
        }
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
    /*
    // Remember tabs
    this.$$(document).on('tab:show', function(e) {
      console.log(this.$f7)
      console.log(e)
    })
    */

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
