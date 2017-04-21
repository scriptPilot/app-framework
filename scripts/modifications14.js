/*

  Purpose: Apply necessary modifications to older versions to prepare version 1.4

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let fs = require('fs-extra')
let rec = require('recursive-readdir')

if (env.installed) {
  alert('Release modifications of v1.4 ongoing - please wait ...')
  try {
    // Configuration update
    // ... done in upgrade-config.js
    // Update strings in files
    rec(env.app, function (err, files) {
      if (err) alert('Release file modifications of v1.4 failed.', 'issue')
      files.map(function (file) {
        if (/\.(js|vue)$/.test(file)) {
          let content = fs.readFileSync(file, 'utf8')
          content = content.replace(/\$root\.title/g, '$root.config.title')
          content = content.replace(/\$root\.packageVersion/g, '$root.frameworkVersion')
          fs.writeFileSync(file, content)
        }
      })
      alert('Release modifications of v1.4 done.')
    })
  } catch (err) {
    alert('Release modifications of v1.4 failed.', 'issue')
  }
}
