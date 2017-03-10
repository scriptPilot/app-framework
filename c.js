'use strict'

console.log('C: Start')

module.exports = (msg, action) => {
  process.send && console.log('C: Forward message from B')
  //process.stdout.write(msg)
  process.send && process.send(action === 'error' ? 'exit with error' : 'exit without error')
  //process.exit()
  console.log('C exit in the name of B')
  process.exit(0)
}
console.log('C: End')
