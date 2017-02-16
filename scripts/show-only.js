module.exports = function (msg, exit) {
  if (typeof msg !== 'string') return
  let isError = msg.substr(0, 6).toLowerCase() === 'error:'
  process.stdout.write('\x1bc')
  if (isError) {
    process.stderr.write(msg)
  } else {
    process.stdout.write(msg)
  }
  process.stdout.write('\n')
  if (exit === true) {
    process.exit(isError ? 1 : 0)
  }
}
