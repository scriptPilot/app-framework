/*

  // Purpose
  Clear console window and show alert - exit script optionally.
  - If alert begins with "error" (case-insensitive), process is aborted with error status 1
  - If second argument is "error", process is aborted with error status 1
  - If second argument is "exit", process is aborted with default status 0

*/

// Include packages
let type = require('./type')

// Export function
module.exports = function (msg, action) {
  // Transform several types to string
  if (['undefined', 'null', 'boolean', 'object', 'array'].indexOf(type(msg)) > -1) {
    msg = JSON.stringify(msg)
  }

  // Throw error if msg is no string
  if (type(msg) !== 'string') {
    throw new Error('Input type is not supported as alert.')
  }

  // Check if message is an error
  let isError = msg.substr(0, 5).toLowerCase() === 'error'

  // Reset console window
  process.stdout.write('\x1bc')

  // Show alert
  process.stdout.write(msg)

  // Show line break (console will show working directory again after alert)
  process.stdout.write('\n\n')

  // Abort script
  if (isError || action === 'error' || action === 'exit') {
    process.exit(isError || action === 'error' ? 1 : 0)
  }
}
