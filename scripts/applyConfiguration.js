// Purpose: Apply configuration to the project files

// Import modules
const alert = require('./alert')

// Import jobs
const updateIgnoreFiles = require('./jobs/updateIgnoreFiles')

// Run jobs
updateIgnoreFiles
  .then(() => {
    alert('Configuration applied successfully.')
  })
  .catch((err) => {
    alert('Failed to apply the configuration.', 'issue')
  })
