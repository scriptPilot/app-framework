/* Purpose: Provide client module for webpack development server */

'use strict'

// Load packages
require('eventsource-polyfill') // needed for IE
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

// Subscribe to webpack development server
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
