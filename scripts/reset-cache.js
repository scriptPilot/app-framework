/* Purpose: Clear cache folder */

'use strict'

let env = require('../env')
let alert = require('../lib/alert')
let fs = require('fs-extra')

alert('Cache reset ongoing - please wait ...')
fs.remove(env.cache, function (err) {
  if (err) {
    alert('Error: Failed to reset cache.')
  } else {
    alert('Cache reset done.')
  }
})
