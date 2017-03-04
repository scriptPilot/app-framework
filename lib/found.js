/* Purpose: Check if file or folder exists (input string or array of path fragments) */

'use strict'

// Include modules
let fs = require('fs')
let abs = require('path').resolve

// Export function
module.exports = function () {
  let checkPath = abs.apply(null, arguments)
  try {
    fs.statSync(checkPath)
    return true
  } catch (err) {
    return false
  }
}
