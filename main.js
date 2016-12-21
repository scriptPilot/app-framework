var project = require('json!./project.temp')
var app = require('json!./app.temp')

// Vue
var Vue = require('vue')

// Framework7
//var Framework7 = require('framework7/dist/js/framework7.js')
var Framework7 = require('framework7/dist/js/framework7.min.js')

// iNoBounce
require('inobounce/inobounce.js')
  
// Framework7-Vue
//var Framework7Vue = require('framework7-vue/dist/framework7-vue.js')
var Framework7Vue = require('framework7-vue/dist/framework7-vue.min.js')
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
var App = require(project.appPath + 'app.vue');
  
// Routes
var Routes = []
var routes = app.routes
for (let path in routes) {
  Routes.push({
    path: path,
    component: require(project.appPath + 'pages/' + routes[path] + '.vue')
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
    //this.$f7.sizeNavbars()
    
    // Remember url
    this.$$(document).on('pageInit pageReinit', function(e) {
      if (e.detail.page.url && e.detail.page.url.substr(0, 1) != '#') {        
        localStorage.url = e.detail.page.url
      }
    }.bind(this))
    
    // Remember tab
    
      // Reset on page change
      this.$$(document).on('pageInit pageReinit', function(e) {
        if (e.detail.page.url && e.detail.page.url.substr(0, 1) != '#') {
          localStorage.removeItem('tab')
        }
      })
    
      // Remember on tab change
      this.$$(document).on('show', '.tab', function(e) {
        localStorage.tab = this.$$(e.srcElement).attr('id')
      }.bind(this))
    
    // Remember scroll position
    
      // After page change
      this.$$(document).on('pageInit pageReinit', function(e) {
        if (e.detail.page.url && e.detail.page.url.substr(0, 1) != '#') {
          
          // Reset
          localStorage.removeItem('scrollPosition')
         
          // Page with tabs
          if (this.$$(e.srcElement).find('.tab').length > 0) {
            this.$$(this.$$(e.srcElement).find('.tab')[0]).on('scroll', function(e) {
              localStorage.scrollPosition = e.srcElement.scrollTop
            }.bind(this))
            
          // Page without tabs
          } else {
            this.$$(e.srcElement).find('.page-content').on('scroll', function(e) {
              localStorage.scrollPosition = e.srcElement.scrollTop
            }.bind(this))
          }
         
        }
      }.bind(this))
      
      // After tab change
      this.$$(document).on('show', '.tab', function(e) {
        localStorage.scrollPosition = e.srcElement.scrollTop
        this.$$(e.srcElement).on('scroll', function(e) {
          localStorage.scrollPosition = e.srcElement.scrollTop
        }.bind(this))
      }.bind(this))
      
    // Restore url, tab, scroll position
    let url = localStorage.url ? localStorage.url.substr() : null
    let tab = localStorage.tab ? localStorage.tab.substr() : null
    let scrollPosition = localStorage.scrollPosition ? localStorage.scrollPosition.substr() : null
    this.$nextTick(function() {
      // url

        // not homepage
        if (url && url != app.homepage) {
          this.$f7.getCurrentView().router.load({url: url, animatePages: false, reload: false})      
          
        // homepage
        } else {
          this.$f7.getCurrentView().router.load({url: app.homepage, animatePages: false, reload: true})      
        }
        
      this.$nextTick(function() {
        // tab
        if (tab) {
          this.$f7.showTab('#' + tab)
        }  
        this.$nextTick(function() {
          // scroll position
          if (scrollPosition && scrollPosition != 0) {
            // page with tabs
            if (this.$$('.page-on-center .tab.active').length > 0) {
              this.$$('.page-on-center .tab.active').scrollTop(scrollPosition)
            // page without tabs
            } else {
             this.$$('.page-on-center .page-content').scrollTop(scrollPosition)
            }
          }
        }.bind(this))
      }.bind(this))
    }.bind(this))
    
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