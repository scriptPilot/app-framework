// Purpose: Create/update the .eslintrc file according the app configuration file

// Load modules
const env = require('./env2')
const fs = require('fs-extra')

// Create configuration object
const eslintConfig = env.cfg.app.eslint

// Rewrite airbnb to airbnb-base
if (eslintConfig.extends === 'airbnb') {
  eslintConfig.extends = 'airbnb-base'
}

// Add Vue plugin
eslintConfig.plugins = ['vue']

// Add Node and browser environments
eslintConfig.env = {
  browser: true,
  node: true
}

// Create/update .eslintrc file
fs.writeJson(env.path.proj('.eslintrc'), eslintConfig, { spaces: 2 }, (err) => {
  if (err) {
    env.log.error('Failed to update the ESLint configuration file.')
  } else {
    // Log success
    env.log.progress('File .eslintrc updated')
  }
})
