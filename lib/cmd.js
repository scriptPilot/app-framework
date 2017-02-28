/*

  // Purpose
  Runs script and - depending on the result - calls callback function.

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
  // Copy arguments
  let args = []
  for (let i in arguments) {
    args.push(arguments[i])
  }
  // Add workinDirectory parameter if missing
  if (arguments.length === 1 || type(arguments[1]) === 'function') {
    args.unshift(process.cwd())
  }
  // Get number of arguments
  let no = args.length
  // Get argument values
  let a1 = args[0]
  let a2 = args[1]
  let a3 = args[2]
  let a4 = args[3]
  // Get argument types
  let t1 = type(args[0])
  let t2 = type(args[1])
  let t3 = type(args[2])
  let t4 = type(args[3])
  // Standard argument values
  let dir = process.cwd()
  let commands = []
  let onSuccess = function () { process.exit(0) }
  let onError = function () { process.exit(1) }
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
  let tCommands, aCommands
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
        alert(a4, 'error')
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
