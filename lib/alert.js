let path = require('path')
let fs = require('fs')

module.exports = function (msg, exit) {
  if (typeof msg !== 'string') {
    throw new Error('Alert message should be a string.')
  }
  let isError = msg.substr(0, 5).toLowerCase() === 'error'
  process.stdout.write('\x1bc')
  if (isError) {
    process.stderr.write(msg + "\n\n")
  } else {
    process.stdout.write(msg + "\n\n")
  }
  if (isError || exit === true) {
    process.exit(isError ? 1 : 0)
  }
}
