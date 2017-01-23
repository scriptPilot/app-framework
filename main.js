// Load project and app configuration
var app = require(process.env.ROOT_APP + 'package.json')
var project = require(process.env.ROOT_PROJECT + 'package.json')

// Import underscore
window['_'] = require('underscore')

// Import and initialize Firebase
if (process.env.USE_FIREBASE === 'true') {
  window.firebase = require('firebase')
  window.firebase.initializeApp(app.firebase)
  window.db = function (path) {    
    return window.db(path ? path : '/')
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

// Import sortObject function
require('./sortObject.js')

// Import mixin for page runtime management
Vue.mixin(require('./pageMixin.js'))

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
    app: App
  },
  mounted: require('./appMounted.js'),
  watch: {
    language: function (newLanguage) {
      localStorage.language = newLanguage
    }
  }  
})
