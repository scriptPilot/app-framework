/*

  Purpose: Apply necessary modifications to older versions to prepare version 1.6+

*/

'use strict'

// Include modules
let env = require('./env')
let alert = require('./alert')
let found = require('./found')
let fs = require('fs-extra')
let path = require('path')
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
    // Add missing language folder
    if (found(env.app) && !found(env.app, 'lang')) {
      fs.readdir(env.app, function (err, files) {
        if (err) alert('Failed to add language folder modification.', 'issue')
        if (files.length > 1) {
          try {
            fs.ensureDirSync(path.resolve(env.app, 'lang'))
            fs.writeJsonSync(path.resolve(env.app, 'lang/' + (env.cfg.language || env.cfg.defaultLanguage || 'en') + '.json'), {}, { spaces: 2 })
          } catch (err) {
            alert('Failed to create languages folder.', 'issue')
          }
        }
      })
    }
    // Rename storage-rules.txt
    if (found(env.app, 'storage-rules.txt') && !found(env.app, 'firebase-storage.txt')) {
      fs.renameSync(path.resolve(env.app, 'storage-rules.txt'), path.resolve(env.app, 'firebase-storage.txt'))
    }
    // Rename database-rules.json
    if (found(env.app, 'database-rules.json') && !found(env.app, 'firebase-database.json')) {
      fs.renameSync(path.resolve(env.app, 'database-rules.json'), path.resolve(env.app, 'firebase-database.json'))
    }
    // Alert
    alert('Release modifications of v1.6+ done.')
  })
}
