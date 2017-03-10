/*

  Purpose: Clear console, show message and exit script optionally.

  Usage: alert(message <string>, [type <"error"/"issue"/"exit">])

  Type argument:
  - "error" to show "Error: <message>" and exit script with error status
  - "issue" as above plus a request to open an issue on GitHub
  - "exit" ro show "<message>" and exit without error status

*/

'use strict'

module.exports = function (message, type) {
  // Set default values for missing message
  if (message === undefined) {
    message = 'Missing argument "message" for function alert().'
    type = 'issue'
  }
  // Prefix error keyword
  if (type === 'error' || type === 'issue') {
    message = 'Error: ' + message
  }
  // Append GitHub information
  if (type === 'issue') {
    message = message + '\n\nPlease open an incident on GitHub:\nhttps://github.com/scriptPilot/app-framework/issues'
  }
  // Reset console window, show message and line breaks
  process.stdout.write('\x1bc' + message + '\n\n')
  // Exit script
  if (type === 'error' || type === 'issue' || type === 'exit') {
    // Define exit code
    let exitCode = (type === 'error' || type === 'issue') && process.env.subProcess === 'true' ? 1 : 0
    // Exit
    process.exit(exitCode)
  }
}
