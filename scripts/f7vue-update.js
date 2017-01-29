// Load configuration
var cfg = require('../config.js')

// Load packages
var path = require('path')
var isThere = require('is-there')
var run = require('child_process').exec
var ora = require('ora')

// Framework7-Vue folder exists
let f7vueFolder = path.resolve(cfg.packageRoot, '..', 'Framework7-Vue')
if (isThere(f7vueFolder)) {
  
  // Build
  let spin = ora('Build Framework7-Vue ...').start()
  run('cd "' + f7vueFolder + '" && npm run build', function (err, stdOut, errOut) {
    if (!err) {
      spin.succeed('Framework7-Vue build done')
    } else {
      console.log(errOut)
    }
  })
  
} else {
  console.log('Error: Framework7-Vue folder not found')
}