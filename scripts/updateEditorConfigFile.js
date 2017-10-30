// Purpose: Update .editorconfig file according app/config.json

// Import modules
const env = require('./env')
const alert = require('./alert')
const fs = require('fs-extra')
const path = require('path')

// Check availability of the config
if (!env.cfg.editorConfig) throw new Error('Missing editorConfig item in config.json file.')

// Create file content
let content = ''

// Loop config options
for (let item in env.cfg.editorConfig) {
  content = content + item + (env.cfg.editorConfig[item] ? ' = ' + env.cfg.editorConfig[item] : '') + '\n'
}

// Create/update .editorconfig file
fs.writeFile(path.resolve(env.app, '.editorconfig'), content, (err) => {
  if (err) throw err
  alert('.editorconfig file updated.')
})
