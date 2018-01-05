// Purpose: Update .gitignore and .npmignore files bases on the scripts and app configuration

// Load modules
const path = require('../path')
const fs = require('fs-extra')
const _ = require('lodash')

// Export promise
module.exports = new Promise((resolve, reject) => {

  // Load configuration file
  const appConfig = fs.readJsonSync(path.app('config.json'))

  // Create file content
  let content = ''

  // Loop config options
  for (let item in appConfig.editorConfig) {
    content = content + item + (appConfig.editorConfig[item] ? ' = ' + appConfig.editorConfig[item] : '') + '\n'
  }

  // Create/update .editorconfig file
  fs.writeFile(path.pkg('.editorconfig'), content, (err) => {
    if (err) throw err

    // Resolve promise
    resolve()

  })

})
