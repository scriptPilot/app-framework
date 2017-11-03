// Purpose: Update .npmrc file according the app configuration

// Load modules
const env = require('./env2')
const fs = require('fs-extra')
const _ = require('lodash')

// Generate rows
const rows = []
_.forEach(env.cfg.app.npmrc, (val, key) => {
  rows.push(`${key}=${val}`)
})

// Create/update file
fs.writeFile(env.path.proj('.npmrc'), rows.join('\n'), (err) => {
  if (err) env.log.issue('Failed to update file .npmrc')
  else env.log.progress('File .npmrc updated')
})
