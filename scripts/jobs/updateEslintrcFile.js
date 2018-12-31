// Purpose: Update .eslintrc file according the app config file

// Load modules
const path = require('../path')
const fs = require('fs-extra')

// Export promise
module.exports = new Promise((resolve, reject) => {

  // Load configuration file
  const appConfig = fs.readJsonSync(path.app('config.json'))

  // Create configuration object
  const eslintConfig = appConfig.eslint

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
  fs.writeJson(path.pkg('.eslintrc'), eslintConfig, { spaces: 2 }, (err) => {
    if (err) {
      reject('Failed to update the ESLint configuration file.')
    } else {
      resolve()
    }
  })

})
