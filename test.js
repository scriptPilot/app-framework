let jsonScheme = require('./lib/json-scheme')
let abs = require('path').resolve

let markdown = jsonScheme.markdown(abs(__dirname, 'config-scheme.json'))

console.log(markdown)
