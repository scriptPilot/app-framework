/* Purpose: Build Framework7-Vue and copy dist and kitchen sink files to App Framework */

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let fs = require('fs-extra')
let abs = require('path').resolve
// let rec = require('recursive-readdir')

// Check App Framework development mode
if (env.installed === true) {
  alert('Framework7-Vue update is only possible in App Framework development mode.', 'error')
}

// Check Framework7-Vue folder
let f7VueFolder = abs(env.proj, '../Framework7-Vue')
if (!found(f7VueFolder)) {
  alert('Cannot find Framework7-Vue folder.', 'error')
}

// Build Framework7-Vue
alert('Framework7-Vue build process ongoing - please wait ...')
cmd(f7VueFolder, 'npm run build', function () {
  alert('Framework7-Vue distribution process ongoing - please wait ...')
  cmd(f7VueFolder, 'npm run dist', function () {
    alert('Copying build files to App Framework folder - please wait ...')
    // Empty current directories
    fs.emptyDirSync(abs(env.proj, 'vendor/Framework7-Vue'))
    /* fs.emptyDirSync(abs(env.app, 'pages/f7vue')) */
    // Copy file
    fs.copySync(abs(f7VueFolder, 'dist/framework7-vue.js'), abs(env.proj, 'vendor/Framework7-Vue/framework7-vue.js'))
    fs.copySync(abs(f7VueFolder, 'dist/framework7-vue.min.js'), abs(env.proj, 'vendor/Framework7-Vue/framework7-vue.min.js'))
    /* fs.copySync(abs(f7VueFolder, 'kitchen-sink/pages'), abs(env.app, 'pages/f7vue'))
    // Rename files (to be in line with automatic routing)
    let rename = [
      ['pull-refresh', 'pull-to-refresh'],
      ['nested-routes-tabs', 'nested-routes/tabs'],
      ['nested-routes/tabs/tab1', 'nested-routes/tabs_tab1'],
      ['nested-routes/tabs/tab2', 'nested-routes/tabs_tab2'],
      ['nested-routes/tabs/tab3', 'nested-routes/tabs_tab3'],
      ['nested-routes/tabs/tab3-alternate-content', 'nested-routes/tabs_tab3_alternate-content'],
      ['nested-routes-tabbar', 'nested-routes/tabbar'],
      ['nested-routes/tabs/tabbar-tab1', 'nested-routes/tabbar_tab1'],
      ['nested-routes/tabs/tabbar-tab2', 'nested-routes/tabbar_tab2'],
      ['nested-routes/tabs/tabbar-tab3', 'nested-routes/tabbar_tab3'],
      ['nested-routes/tabs/tabbar-tab3-alternate-content', 'nested-routes/tabbar_tab3_alternate-content']
    ]
    rename.map(function (item) {
      fs.renameSync(abs(env.app, 'pages/f7vue/' + item[0] + '.vue'), abs(env.app, 'pages/f7vue/' + item[1] + '.vue'))
    })
    // Remove empty folder
    fs.removeSync(abs(env.app, 'pages/f7vue/nested-routes/tabs'))
    // Update f7vue modals in the app component
    let indexPage = fs.readFileSync(abs(f7VueFolder, 'kitchen-sink/index.html'), 'utf8')
    let indexModals = indexPage.match(/<f7-(popover|picker-modal|popup|login-screen|actions)([\s\S.]+?)<\/f7-(popover|picker-modal|popup|login-screen|actions)>/g)
    let appPage = fs.readFileSync(abs(env.app, 'app.vue'), 'utf8')
    appPage = appPage.replace(/<!-- f7vue-modals -->([\s\S.]+?)<!-- \/f7vue-modals -->/, '<!-- f7vue-modals -->\n    ' + indexModals.join('\n    ') + '\n    <!-- /f7vue-modals -->')
    fs.writeFileSync(abs(env.app, 'app.vue'), appPage)
    // Create f7vue/home.vue page
    let mainView = indexPage.match(/<f7-views([\s\S.]+)<\/f7-views>/)[1]
    let mainViewLists = mainView.match(/<f7-list([\s\S.]+?)<\/f7-list>/g)
    let homePage = '<template>\n' +
                   '  <f7-page>\n' +
                   '    <f7-navbar back-link="Back" title="Framework7-Vue" sliding />\n' +
                   '    ' + mainViewLists.join('\n  ').replace(/ {9}/g, '') + '\n' +
                   '  </f7-page>\n' +
                   '</template>\n'
    fs.writeFileSync(abs(env.app, 'pages/f7vue/home.vue'), homePage)
    // Modify pages
    rec(abs(env.app, 'pages/f7vue'), function (err, pages) {
      if (err) {
        alert('Failed to list page files.', 'error')
      } else {
        for (let p = 0; p < pages.length; p++) {
          let page = fs.readFileSync(pages[p], 'utf8')
          // Route links
          page = page.replace(/(link|href)="\//g, '$1="/f7vue/')
          page = page.replace(/\/(tabs|tabbar)\/tab-(1|2|3)\//g, '/$1/tab$2/')
          // $root data access
          page = page.replace(/\$root/g, '$root.$children[0]')
          fs.writeFileSync(pages[p], page)
        }
        // Reset routes for f7vue
        if (found(abs(env.app, 'routes.json'))) {
          let routes = fs.readJsonSync(abs(env.app, 'routes.json'))
          let newRoutes = []
          routes.map(function (route) {
            if (/^\/f7vue\//.test(route.path) === false) {
              newRoutes.push(route)
            }
          })
          fs.writeJsonSync(abs(env.app, 'routes.json'), newRoutes)
        }
        // Show alert
        alert('Framework7-Vue update done.')
      }
    })
    */
    alert('Framework7-Vue update done.')
  }, 'Framework7-Vue distribution process failed.')
}, 'Framework7-Vue build process failed.')
