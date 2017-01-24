var pkg = require('../package.json')
var app = require('..' + pkg.appRoot + 'package.json')

var isThere = require('is-there')
var deleteFiles = require('delete')
var path = require('path')

if (isThere(path.resolve(__dirname, '..' + pkg.appRoot + '.firebaserc'))) {
  deleteFiles.sync([path.resolve(__dirname, '..' + pkg.appRoot + '.firebaserc')])
}
if (isThere(path.resolve(__dirname, '..' + pkg.appRoot + 'firebase.json'))) {
  deleteFiles.sync([path.resolve(__dirname, '..' + pkg.appRoot + 'firebase.json')])
}

module.exports = {}