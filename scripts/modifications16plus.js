/*

  Purpose: Apply necessary modifications to older versions to prepare version 1.6+

*/

'use strict'

// Include modules
let env = require('./env')
let alert = require('./alert')
let fs = require('fs-extra')
let rec = require('recursive-readdir')

if (env.installed) {
  alert('Release modifications of v1.6+ ongoing - please wait ...')
  // Update strings in files
  rec(env.app, function (err, files) {
    if (err) alert('Release file modifications of v1.6+ failed.', 'issue')
    files.map(function (file) {
      if (/\.(js|vue)$/.test(file)) {
        let content = fs.readFileSync(file, 'utf8')
        content = content.replace(/\$root\.framework\.version/g, '$root.frameworkVersion')
        content = content.replace(/\$root\.project\.version/g, '$root.version')
        fs.writeFileSync(file, content)
      }
    })
    alert('Release modifications of v1.6+ done.')
  })
}
