var childProcess = require('child_process')
var alert = require('./alert')

module.exports = function () {
  // Standard arguments
  let cwd = process.cwd()
  let commands = []
  let callback = function () {}
  let errorText = null

  // Check arguments
  if (arguments.length === 1 && Array.isArray(arguments[0])) {
    commands = arguments[0]
  } else if (arguments.length === 2 && Array.isArray(arguments[0]) && typeof arguments[1] === 'string') {
    commands = arguments[0]
    errorText = arguments[1]
  } else if (arguments.length === 2 && typeof arguments[0] === 'string' && Array.isArray(arguments[1])) {
    cwd = arguments[0]
    commands = arguments[1]
  } else if (arguments.length === 3 && typeof arguments[0] === 'string' && Array.isArray(arguments[1]) && typeof arguments[2] === 'string') {
    cwd = arguments[0]
    commands = arguments[1]
    errorText = arguments[2]
  } else if (arguments.length === 2 && Array.isArray(arguments[0]) && typeof arguments[1] === 'function') {
    commands = arguments[0]
    callback = arguments[1]
  } else if (arguments.length === 3 && Array.isArray(arguments[0]) && typeof arguments[1] === 'function' && typeof arguments[2] === 'string') {
    commands = arguments[0]
    callback = arguments[1]
    errorText = arguments[2]
  } else if (arguments.length === 3 && typeof arguments[0] === 'string' && Array.isArray(arguments[1]) && typeof arguments[2] === 'function') {
    cwd = arguments[0]
    commands = arguments[1]
    callback = arguments[2]
  } else if (arguments.length === 4 && typeof arguments[0] === 'string' && Array.isArray(arguments[1]) && typeof arguments[2] === 'function' && typeof arguments[3] === 'string') {
    cwd = arguments[0]
    commands = arguments[1]
    callback = arguments[2]
    errorText = arguments[3]
  } else {
    throw new Error('Ivalid arguments passed.')
  }

  // Add CMD commands for Windows
  if (process.platform === 'win32') {
    commands.unshift('cmd.exe', '/c')
  }

  // Spawn process
  let child = childProcess.spawn(commands.shift(), commands, {cwd: cwd, stdio: 'inherit'})

  // Callback on exit without error code
  child.on('close', function (code) {
    if (code === 0) {
      callback()
    } else if (errorText !== null) {
      alert(errorText, true)
    } else {
      commands.shift()
      alert('Error: Command "' + commands.join(' ') + '" failed.')
    }
  })
}
