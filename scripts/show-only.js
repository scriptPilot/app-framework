module.exports = function (msg) {
  process.stdout.write('\x1bc')
  console.log(msg)
  console.log('\n')
}
