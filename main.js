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

// Load app configuration
var app = require(process.env.ROOT_APP + 'package.json')

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
  }
});
