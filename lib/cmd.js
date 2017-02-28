/*

  // Parameters
  cmd (
    workingDirectory <undefined/string/array>,
    parameters <string/array>,
    onSuccess <undefined/null/function/string>,
    onError <undefined/function/string>
  )

  // Allowed function calls
  cmd (                  parameters)
  cmd (workingDirectory, parameters)
  cmd (workingDirectory, parameters, onSuccess)
  cmd (workingDirectory, parameters, onSuccess, onError)
  cmd (                  parameters, onSuccess <function>)
  cmd (                  parameters, onSuccess <function>, onError)

*/

// Load packages
var childProcess = require('child_process')
var abs = require('path').resolve
var alert = require('./alert')
var type = require('./type')

module.exports = function () {
  // Add workinDirectory parameter if missing
  if (arguments.length === 1 || type(arguments[1]) === 'function') {
    let temp = {0: process.cwd()}
    for (let i = 0; i < arguments.length; i++) {
      temp[i+1] = arguments[i]
    }
    arguments = temp
  }
  // Get number of arguments
  let no = 0
  for (let i in arguments) no++
  // Get argument values
  let a1 = arguments[0]
  let a2 = arguments[1]
  let a3 = arguments[2]
  let a4 = arguments[3]
  // Get argument types
  let t1 = type(arguments[0])
  let t2 = type(arguments[1])
  let t3 = type(arguments[2])
  let t4 = type(arguments[3])
  // Standard argument values
  let dir = process.cwd()
  let commands = []
  let onSuccess = function () {}
  let onError = function () {
    //process.exit()
  }
  // Function to abort on invalid arguments
  let abort = function (details) {
    details = details !== undefined ? ' - ' + details : '.'
    alert('Error: Invalid arguments passed' + details)
  }
  // Check number of arguments
  if (no < 1 || no > 4) abort('Should be one to four arguments.')
  // Parse workingDirectory
  if (no >= 2) {
    if (t1 === 'string') dir = a1
      else if (t1 === 'array') dir = abs.apply(null, a1)
      else abort('WorkingDirectory should be a string or an array.')
  }
  // Parse commands
  if (no === 1) {
    tCommands = t1
    aCommands = a1
  } else {
    tCommands = t2
    aCommands = a2
  }
  if (tCommands === 'string') {
    commands = aCommands.split(' ')
  } else if (tCommands === 'array') {
    commands = aCommands
  } else abort('Commands should be a string or an array.')
  // Parse onSuccess
  if (no >= 3) {
    if (t3 === 'string') {
      onSuccess = function () {
        alert(a3)
      }
    } else if (t3 === 'function') {
      onSuccess = a3
    } else if (t3 === 'null') {
      onSuccess = function () {}
    } else abort('OnSuccess should be a string or a function.')
  }
  // Parse onError
  if (no >= 4) {
    if (t4 === 'string') {
      onError = function () {
        alert(a4, 'exit')
      }
    } else if (t4 === 'function') {
      onError = a4
    } else abort('OnError should be a string or a function')
  }

  // Spawn process
  let child = childProcess.spawn(commands.shift(), commands, {cwd: dir, stdio: 'inherit', shell: true})
  child.on('close', function (code) {
    if (code === 0) {
      onSuccess()
    } else {
      onError()
    }
  })

}
