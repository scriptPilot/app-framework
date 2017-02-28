let path = require('path')
let fs = require('fs')
let type = require('./type')

module.exports = function (msg, exit) {
  if (type(msg) !== 'function') {
    msg = type(msg) === 'string' ? msg : JSON.stringify(msg)
  } else {
    throw new Error('Alert message should be a string.')
  }
  let isError = msg.substr(0, 5).toLowerCase() === 'error'
  process.stdout.write('\x1bc')
  if (isError) {
    process.stderr.write(msg + '\n\n')
  } else {
    process.stdout.write(msg + '\n\n')
  }
    console.log('sub' + process.pid)
  if (isError || exit === true || exit === 'exit') {
    process.exit(isError && process.env.isChildProcess === 'true' ? 1 : 0)
  }
}
