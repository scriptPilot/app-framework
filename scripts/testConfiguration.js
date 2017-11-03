// Purpose: Check scripts and app configuration schemes and configuration files itself

// Import modules
const env = require('./env2')
const jsonSchemeTools = require('json-scheme-tools')

// Function to fix the configuration
const fixConfig = (type) => {
  // Check type
  if (type !== 'app' && type !== 'scripts') env.log.issue('Failed to fix the configuration files')
  // Fix configuration
  const result = jsonSchemeTools.fix(env.path.scripts(`scheme.${type}.json`), env.path[type]('config.json'))
  // If errors found
  if (env.type(result) === 'array') {
    // Show error message
    env.log.error(`Errors in the ${type} config scheme:\n- ${result.join('\n- ')}`)
  // If no errors found
  } else {
    // Show progress
    env.log.progress(`Fixed configuration file ${type}/config.json`)
  }
}

// Call Function
fixConfig('app')
fixConfig('scripts')
