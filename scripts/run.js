let childProcess = require('child_process')

module.exports = function (command, callbackOnSuccess) {
  childProcess.exec(command, function (err, stdOut, errOut) {
    // Skip specific errors
    if (/(.*)The plugin '(.+) is required by/.test(errOut)) {
      err = undefined
    }
    if (!err) {
      if (typeof callbackOnSuccess === 'function') {
        callbackOnSuccess()
      }
    } else {
      throw new Error(errOut)
    }
  })
}
