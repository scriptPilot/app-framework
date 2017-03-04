'use strict'

let childProcess = require('child_process')
let alert = require('../lib/alert')

module.exports = function (command, callbackOnSuccess, callbackOnError) {
  childProcess.exec(command, function (err, stdOut, errOut) {
    if (!err) {
      if (typeof callbackOnSuccess === 'function') {
        callbackOnSuccess(stdOut)
      }
    } else if (typeof callbackOnError === 'function') {
      callbackOnError(errOut)
    } else if (typeof callbackOnError === 'string') {
      alert('Error: ' + callbackOnError)
    } else {
      throw new Error(errOut)
    }
  })
}
