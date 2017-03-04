let jsonScheme = require('./lib/json-scheme')
let abs = require('path').resolve

let result = jsonScheme.fix(abs(__dirname, 'config-scheme.json'), abs(__dirname, 'test.json'))
console.log(result)
