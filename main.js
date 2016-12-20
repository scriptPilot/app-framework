// Load files
var pkg = require('./package.json')
var project = pkg.appPath == '../../' ? require('../../package.json') : require('./package.json');
var app = pkg.appPath == '../../' ? require('../../package.json') : require('./hello-world-app/package.json');

/*
var project = require('json!./project.temp')
var app = require('json!./app.temp')


const appPath = '../../';
*/
// Vue
var Vue = require('vue')

// Framework7
var Framework7 = require('framework7/dist/js/framework7.js')

// iNoBounce
require('inobounce/inobounce.js')
  
// Framework7-Vue
var Framework7Vue = require('framework7-vue/dist/framework7-vue.js')
Vue.use(Framework7Vue)

// Icons
if (app.icons.framework7 === true) {
  require('framework7-icons/css/framework7-icons.css')
}
if (app.icons.material === true) {
  require('./libs/material-icons.css')
}

// Main css
require('./main.css');

// App component
var App = pkg.appPath == '../../' ? require('../../app.vue') : require('./hello-world-app/app.vue');
  
// Routes
var Routes = []
var routes = app.routes
for (let path in routes) {
  Routes.push({
    path: path,
    component: pkg.appPath == '../../' ? require('../../pages/' + routes[path] + '.vue') : require('./hello-world-app/pages/' + routes[path] + '.vue')
  })
}
  
// Text patterns
var lang = {
  en: {
    smartSelectBackText: 'Back',
    smartSelectPopupCloseText: 'Close',
    smartSelectPickerCloseText: 'Done'
  },
  de: {
    smartSelectBackText: 'Zurück',
    smartSelectPopupCloseText: 'Schließen',
    smartSelectPickerCloseText: 'Fertig'
  }
}
    
// Init Vue App
var config = app;
config.version = project.version;
config.lang = localStorage.lang ? localStorage.lang : config.lang;
config.theme = localStorage.theme ? localStorage.theme : config.theme;

require('framework7/dist/css/framework7.' + config.theme + '.css')
require('framework7/dist/css/framework7.' + config.theme + '.colors.css')

new Vue({

  // Rendering
  el: '#app',
  components: {
    'app': App
  },

  // Framework7 parameters
  framework7: {
    root: '#app',
    animateNavBackIcon: true,
    routes: Routes,
    /*pushState: true,*/
    pushStateSeparator: '#/',
    pushStateNoAnimation: true,
    material: config.theme === 'material' ? true : false
  },

  // Set default language and config
  data: {
    lang: config.lang,
    theme: config.theme,
    version: config.version
  },

  // Do stuff after app is mounted
  mounted: function() {        
    // Set language text patterns    
    this.changeTextPatterns()
    // Show application
    this.$$('#app').show()
    // Resize navbars
    this.$f7.sizeNavbars()
    // Remember url
    this.$$(document).on('pageInit pageReinit', function(e) {
      if (e.detail.page.url && e.detail.page.url.substr(0, 1) != '#') {
        localStorage.url = e.detail.page.url
      }
    })
    // Restore url (does not work properly with pushState:true (not really neded for native apps)
    if (localStorage.url) {
      if (this.$f7.getCurrentView().url != localStorage.url) {
        //this.$f7.getCurrentView().router.load({url: localStorage.url, animatePages: false})
        //this.$f7.getCurrentView().router.back({url:'home', force: true})
      }
    }
    // Remember tab
    this.$$(document).on('show', '.tab', function(e) {
      localStorage.tab = this.$$(e.srcElement).attr('id')
    }.bind(this))
    this.$$(document).on('pageInit pageReinit', function(e) {
      if (e.detail.page.url && e.detail.page.url.substr(0, 1) != '#' && e.detail.page.fromPage) {
        localStorage.removeItem('tab')
      }
    }.bind(this))
    // Restore tab
    if (localStorage.tab) {
      console.log(this.$f7.showTab)
      console.log('show #' + localStorage.tab)
    }
  },

  // Change text patterns on language change
  watch: {
     lang: function() {
       localStorage.lang = this.lang;
       this.changeTextPatterns()
     },
     theme: function() {
       localStorage.theme = this.theme;
       window.location.reload();
     }     
  },

  // Change text patterns function
  methods: {
    changeTextPatterns: function() {      
      for (var el in lang[this.lang]) {
        this.$f7.params[el] = lang[this.lang][el]
      }
    }    
  }

})