// Purpose: Update icon fonts in vendor folder

'use strict'

// Import modules
let alert = require('./alert')
let found = require('./found')
let fs = require('fs-extra')
let abs = require('path').resolve

// Define single steps
function updateMaterialDesignIcons (callback) {
  alert('Material Design Icon font update ongoing - please wait ...')
  // Define source and destination folder
  let source = abs(__dirname, '../../material-design-icons/iconfont')
  let dest = abs(__dirname, '../vendor/material-icons')
  // Material Design Icons folder found
  if (found(source)) {
    // Define files to copy
    let files = [
      'material-icons.css',
      'MaterialIcons-Regular.eot',
      'MaterialIcons-Regular.woff',
      'MaterialIcons-Regular.woff2',
      'MaterialIcons-Regular.ttf'
    ]
    // Check if all files exist in source folder (before delete anything in vendor folder)
    files.map(file => {
      if (!found(source, file)) {
        alert('File "' + file + '" not found in source folder.', 'error')
      }
    })
    // Empty destination folder
    try {
      fs.emptyDirSync(dest)
    } catch (err) {
      alert('Failed to empty material icons destination folder.', 'issue')
    }
    // Copy files
    try {
      files.map(file => {
        fs.copySync(abs(source, file), abs(dest, file))
      })
    } catch (err) {
      alert('Failed to copy material icons files.', 'issue')
    }
    // Update codepoint file
    try {
      // Read codepoints
      let codepointsFile = fs.readFileSync(abs(source, 'codepoints'), 'utf8')
      let codepointsRows = codepointsFile.match(/([a-z0-9_]+) ([a-z0-9_]+)/g)
      // Extract codepoints
      let codepoints = {}
      codepointsRows.map(codepoint => {
        codepoint = codepoint.split(' ')
        codepoints[codepoint[0]] = codepoint[1]
      })
      // Save codepoints as JSON
      let jsonFile = abs(__dirname, '../client/material-codepoints.json')
      fs.ensureFileSync(jsonFile)
      fs.writeJsonSync(jsonFile, codepoints, {spaces: 2})
    } catch (err) {
      alert('Failed to update material codepoints file.', 'issue')
    }
    // Show alert
    alert('Material design icons font update done.')
    // Callback
    callback()
  // Material Design Icons folder not found
  } else {
    // Show error alert
    alert('Folder "material-design-icons/iconfont" not found.', 'error')
  }
}

// Run script
updateMaterialDesignIcons(() => {
  alert('Icon fonts update done.')
})
