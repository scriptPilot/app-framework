'use strict'

/*

  // Purpose
  Runs script and - depending on the result - calls callback function.

  // Parameters
  cmd (
    workingDirectory <string/array>,
    parameters <string/array>,
    onSuccess <undefined/null/function/string>,
    onError <undefined/function/string>
  )

*/

// Load packages
var childProcess = require('child_process')
var abs = require('path').resolve
var alert = require('./alert')
var type = require('./type')

module.exports = function () {
  // Check number of arguments
  let no = arguments.length
  if (no < 2 || no > 4) throw new Error('Function should have two to four arguments.')
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
  // Define parameters
  let dir, commands, onSuccess, onError
  // Parse working directory
  if (t1 === 'string') dir = a1
  else if (t1 === 'array') dir = abs.apply(null, a1)
  else throw new Error('WorkingDirectory should be a string or an array.')
  // Parse commands
  if (t2 === 'string') commands = a2.split(' ')
  else if (t2 === 'array') commands = a2
  else throw new Error('Commands should be a string or an array.')
  // Parse onSuccess
  if (t3 === 'string') onSuccess = function () { alert(a3) }
  else if (t3 === 'function') onSuccess = a3
  else if (t3 === 'undefined' || t3 === 'null') onSuccess = function () {}
  else throw new Error('OnSuccess should be a string, a function or null.')
  // Parse onError
  if (t4 === 'string') onError = function () { alert(a4, 'noexit') }
  else if (t4 === 'function') onError = a4
  else if (t4 === 'undefined') onError = function () { }
  else throw new Error('OnError should be a string or a function')
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
