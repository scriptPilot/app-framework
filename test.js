let jsonScheme = require('./lib/json-scheme')
let abs = require('path').resolve

let markdown = jsonScheme.markdown(abs(__dirname, 'config-scheme.json'), abs(__dirname, 'DOCUMENTATION.md'), 'config-options')
