// Purpose: Provide function to get absolute path

// Load modules
const fs = require('fs')
const path = require('path')

// Check if App Framework is installed as a module or not
const isInstalled = fs.existsSync(path.resolve(__dirname, '../../../package.json'))

// Export functions to get absolute path
module.exports = {
  // Package
  pkg (...args) {
    return isInstalled ? path.resolve(__dirname, '../../../', ...args) : path.resolve(__dirname, '../', ...args)
  },
  // App folder
  app (...args) {
    return isInstalled ? path.resolve(__dirname, '../../../app', ...args) : path.resolve(__dirname, '../demo', ...args)
  },
  // Node modules folder
  modules (...args) {
    return isInstalled ? path.resolve(__dirname, '../../../node_modules/', ...args) : path.resolve(__dirname, '../node_modules/', ...args)
  },
  // Cache folder
  cache (...args) {
    return isInstalled ? path.resolve(__dirname, '../../../node_modules/.app-framework-cache/', ...args) : path.resolve(__dirname, '../node_modules/.app-framework-cache/', ...args)
  },
  // Scripts folder
  scripts (...args) {
    return isInstalled ? path.resolve(__dirname, '../../../node_modules/app-framework/scripts/', ...args) : path.resolve(__dirname, '../scripts/', ...args)
  }
}
