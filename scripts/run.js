let childProcess = require('child_process')

module.exports = function (command, callbackOnSuccess) {
  childProcess.exec(command, function (err, stdOut, errOut) {
    if (!err) {
      if (typeof callbackOnSuccess === 'function') {
        callbackOnSuccess()
      }
    } else {
      throw new Error(errOut)
    }
  })
}
