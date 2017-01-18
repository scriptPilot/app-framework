// Load project and app configuration
var app = require(process.env.ROOT_APP + 'package.json')
var project = require(process.env.ROOT_PROJECT + 'package.json')

// Import and initialize Firebase
if (process.env.USE_FIREBASE === 'true') {
  window.firebase = require('firebase')
  firebase.initializeApp(app.firebase)
} else {
  window.firebase = null
}

// Import Vue
var Vue = require('vue')

// Import F7
var Framework7 = require('framework7')

// Import F7 Vue Plugin
var Framework7Vue = require('framework7-vue')

// Import F7 iOS Theme Styles
if (process.env.THEME === 'material') {  
  var Framework7Theme = require('framework7/dist/css/framework7.material.min.css')
  var Framework7ThemeColors = require('framework7/dist/css/framework7.material.colors.min.css')
} else {
  var Framework7Theme = require('framework7/dist/css/framework7.ios.min.css')
  var Framework7ThemeColors = require('framework7/dist/css/framework7.ios.colors.min.css')  
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
var inobounce = require('inobounce')

// Import main css
var MainCSS = require('./main.css')

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
new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  data: {
    language: localStorage.language ? localStorage.language : app.defaultLanguage,
    version: project.version
  },
  framework7: {
    root: '#app',
    /* Uncomment to enable Material theme: */
    // material: true,
    routes: Routes,
    material: process.env.THEME === 'material' ? true : false
  },
  // Register App Component
  components: {
    app: App
  },
  mounted: function() {
    
    // Remember histories
    this.$$(document).on('page:afteranimation', function(e) {
      setTimeout(function() {
        let histories = []
        for (let v=0; v<this.$f7.views.length; v++) {
          let history = []
          for (let h=0; h<this.$f7.views[v].history.length; h++) {
            if (this.$f7.views[v].history[h].substr(0, 1) != '#') {
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
      if (histories.length == this.$f7.views.length) {
        for (let v=0; v<histories.length; v++) {
          for (let h=0; h<histories[v].length; h++) {
            setTimeout(function() {
              this.$f7.views[v].router.load({url: histories[v][h], animatePages: false})
            }.bind(this), 0)
          }
        }
      }
    }
    
    // Remember panel/popup/loginscreen
    this.$$(document).on('panel:opened', function(e) {
      localStorage.panel = /left/.test(e.path[0]._prevClass) ? 'left' : 'right'
    })
    this.$$(document).on('panel:closed', function(e) {
      localStorage.removeItem('panel')
    })
    this.$$(document).on('popup:opened', function(e) {
      localStorage.popup = e.srcElement.id
    })
    this.$$(document).on('popup:closed', function(e) {
      localStorage.removeItem('popup')
    })
    this.$$(document).on('loginscreen:opened', function(e) {
      localStorage.loginscreen = e.srcElement.id
    })
    this.$$(document).on('loginscreen:closed', function(e) {
      localStorage.removeItem('loginscreen')
    })
    
    // Restore panel/popup/loginscreen
    if (localStorage.panel) {
      setTimeout(function() {
        this.$f7.openPanel(localStorage.panel)
      }.bind(this), 0)
    }
    if (localStorage.popup) {
      setTimeout(function() {
        this.$f7.popup('#' + localStorage.popup)
      }.bind(this), 0)
    }
    if (localStorage.loginscreen) {
      setTimeout(function() {
        this.$f7.loginScreen('#' + localStorage.loginscreen)
      }.bind(this), 0)
    }
    
    // Show app
    setTimeout(function() {
      this.$$('.framework7-root').css('visibility', 'visible')
    }.bind(this), 0)
    
  },
  watch: {
    language: function(newLanguage) {
      localStorage.language = newLanguage
    }
  }
});
