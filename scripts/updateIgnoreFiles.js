// Purpose: Update .gitignore and .npmignore files bases on the scripts and app configuration

// Load modules
const env = require('./env2')
const fs = require('fs-extra')
const _ = require('lodash')

// Define function to update file
const updateFile = (type) => {
  // Check parameters
  if (type !== 'git' && type !== 'npm') env.log.issue('Type must be either "git" or "npm"')
  // Merge configurations
  const mergedConfig = _.merge(env.cfg.scripts[`${type}ignore`], env.cfg.app[`${type}ignore`])
  // Filter and sort config
  const sortedConfig = _(mergedConfig).toPairs().filter([1, true]).sortBy(0)
    .fromPairs()
    .value()
  // Create file content
  let fileContent = '# This file is updated automatically, please add or remove files in the configuration file.\n\n'
  _.forEach(sortedConfig, (toBeIncluded, filePath) => {
    fileContent += `${filePath}\n`
  })
  // Create/update file
  fs.writeFileSync(env.path.proj(`.${type}ignore`), fileContent)
  // Log progress
  env.log.progress(`File .${type}ignore updated`)
}

// Run function
updateFile('git')
updateFile('npm')
