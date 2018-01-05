// Purpose: Apply configuration to the project files

// Import modules
const alert = require('./alert')

// Import jobs
const updateIgnoreFiles = require('./jobs/updateIgnoreFiles')
const updateEditorconfigFile = require('./jobs/updateEditorconfigFile')
const updateEslintrcFile = require('./jobs/updateEslintrcFile')

// Run jobs
updateEditorconfigFile
  .then(updateEslintrcFile)
  .then(updateIgnoreFiles)
  .then(() => {
    alert('Configuration applied successfully.')
  })
  .catch(() => {
    alert('Failed to apply the configuration.', 'issue')
  })
