// Purpose: Run ESLint to fix the code, log remaining errors to file eslint.log

// Load modules
const env = require('./env2')
const { spawn } = require('child_process')
const fs = require('fs-extra')

// Log progress
env.log.progress('ESLint is running - please wait ...')

// Define bin file
const binFile = env.path.bin('eslint')

// Start array for parameters
const params = []

// Add folder to check
params.push(env.path.app())
if (!env.isInstalled) {
  params.push(env.path.client())
  params.push(env.path.scripts())
}

// Fix code automatically
params.push('--fix')

// Log to file
const logFile = 'code-unconformities.log'
const logFilePath = env.path.proj(logFile)
params.push('--output-file')
params.push(logFilePath)

// Run ESLint
const process = spawn(binFile, params)

// Act on ESLint processs has finished
process.on('close', (statusCode) => {
  // If errors found, show error message and exit script
  if (statusCode === 1) env.log.error(`ESLint found some unconformities, please check the file ${logFile}`)
  // Else, delete log file
  fs.removeSync(logFilePath)
  // Show progress
  env.log.progress('ESLint code fix done')
})
