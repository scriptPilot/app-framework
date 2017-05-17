/*

  Purpose: Apply necessary modifications to older versions to prepare version 1.4

*/

'use strict'

// Include modules
let env = require('./env')
let alert = require('./alert')
let found = require('./found')
let fs = require('fs-extra')
let abs = require('path').resolve
let rec = require('recursive-readdir')

if (env.installed) {
  alert('Release modifications of v1.4 ongoing - please wait ...')
  try {
    // Configuration update
    // ... done in upgrade-config.js
    // Remove login-screen.vue
    if (found(env.app, 'pages/login-screen.vue')) {
      fs.removeSync(abs(env.app, 'pages/login-screen.vue'))
    }
    if (found(env.app, 'routes.json')) {
      let routes = fs.readJsonSync(abs(env.app, 'routes.json'))
      let newRoutes = []
      for (let r in routes) {
        if (routes[r].component !== 'login-screen.vue' && routes[r].component !== 'login-screen') {
          newRoutes.push(routes[r])
        }
      }
      fs.writeJsonSync(abs(env.app, 'routes.json'), newRoutes)
    }
    // Update strings in files
    rec(env.app, function (err, files) {
      if (err) alert('Release file modifications of v1.4 failed.', 'issue')
      files.map(function (file) {
        if (/\.(js|vue)$/.test(file)) {
          let content = fs.readFileSync(file, 'utf8')
          content = content.replace(/\$root\.title/g, '$root.config.title')
          content = content.replace(/\$root\.packageVersion/g, '$root.framework.version')
          content = content.replace(/\$root\.version/g, '$root.project.version')
          fs.writeFileSync(file, content)
        }
      })
      alert('Release modifications of v1.4 done.')
    })
  } catch (err) {
    alert('Release modifications of v1.4 failed.', 'issue')
  }
}
