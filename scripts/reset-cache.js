/* Purpose: Clear cache folder */

'use strict'

let env = require('./env')
let alert = require('./alert')
let fs = require('fs-extra')

alert('Cache reset ongoing - please wait ...')
fs.remove(env.cache, function (err) {
  if (err) {
    alert('Failed to reset cache.', 'error')
  } else {
    alert('Cache reset done.')
  }
})
