let childProcess = require('child_process')
let showOnly = require('./show-only')

module.exports = function (command, callbackOnSuccess, callbackOnError) {
  childProcess.exec(command, function (err, stdOut, errOut) {
    if (!err) {
      if (typeof callbackOnSuccess === 'function') {
        callbackOnSuccess(stdOut)
      }
    } else if (typeof callbackOnError === 'function') {
      callbackOnError(errOut)
    } else if (typeof callbackOnError === 'string') {
      showOnly('Error: ' + callbackOnError)
    } else {
      throw new Error(errOut)
    }
  })
}
