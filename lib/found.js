let path = require('path')
let fs = require('fs')

module.exports = function () {
  let checkPath = path.resolve.apply(null, arguments)
  try {
    fs.statSync(checkPath)
    return true
  } catch (err) {
    return false
  }
}
