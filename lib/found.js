'use strict'

let abs = require('path').resolve
let fs = require('fs')

module.exports = function () {
  let checkPath = abs.apply(null, arguments)
  try {
    fs.statSync(checkPath)
    return true
  } catch (err) {
    return false
  }
}
