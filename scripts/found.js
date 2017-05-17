/* Purpose: Check if file or folder exists (input string or array of path fragments; case-sensitive) */

'use strict'

// Include modules
let fs = require('fs-extra')
let path = require('path')

// Export function
module.exports = function () {
  try {
    let pathToCheck = path.resolve.apply(null, arguments)
    let dirname = path.dirname(pathToCheck)
    let basename = path.basename(pathToCheck)
    let files = fs.readdirSync(dirname)
    return files.indexOf(basename) > -1
  } catch (err) {
    return false
  }
}
