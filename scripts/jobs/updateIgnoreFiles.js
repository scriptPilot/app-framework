// Purpose: Update .gitignore and .npmignore files bases on the scripts and app configuration

// Load modules
const path = require('../path')
const fs = require('fs-extra')
const _ = require('lodash')

// Export promise
module.exports = new Promise((resolve, reject) => {

  // Load configuration files
  const scriptConfig = fs.readJsonSync(path.scripts('config.json'))
  const appConfig = fs.readJsonSync(path.app('config.json'))

  // Define function to update file
  const updateFile = (type) => {
    // Check parameters
    if (type !== 'git' && type !== 'npm') throw new Error('Type must be either "git" or "npm".')
    // Merge configurations
    const mergedConfig = _.merge(scriptConfig[`${type}ignore`], appConfig[`${type}ignore`])
    // Filter and sort config
    const sortedConfig = _(mergedConfig).toPairs().filter([1, true]).sortBy(0).fromPairs().value()
    // Create file content
    let fileContent = '# This file is updated automatically, please add or remove files in the configuration file.\n\n'
    _.forEach(sortedConfig, (toBeIgnored, filePath) => fileContent += filePath + '\n')
    // Create/update file
    fs.writeFileSync(path.pkg('.' + type + 'ignore'), fileContent)
  }

  // Run function
  updateFile('git')
  updateFile('npm')

  // Resolve Promise
  resolve()

})
