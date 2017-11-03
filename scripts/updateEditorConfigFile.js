// Purpose: Update the .editorconfig file according the app configuration

// Load modules
const env = require('./env2')
const fs = require('fs-extra')
const _ = require('lodash')

// Create file content
let content = ''

// Loop config options
for (let item in env.cfg.app.editorConfig) {
  content = content + item + (env.cfg.app.editorConfig[item] ? ' = ' + env.cfg.app.editorConfig[item] : '') + '\n'
}

// Create/update .editorconfig file
fs.writeFile(env.path.proj('.editorconfig'), content, (err) => {
  if (err) env.log.issue('Failed to update the .editorconfig file')
  env.log.progress('File .editorconfig updated')
})
