const { readFileSync, outputFileSync, readJsonSync } = require('fs-extra')
const mustache = require('mustache')

const config = readJsonSync('app/config.json')
const values = {
  frontendFramework7: config.frontend === 'framework7',
  frontendMaterial: config.frontend === 'material',
  frontendBootstrap: config.frontend === 'bootstrap'
}
outputFileSync('cache/app.js', mustache.render(readFileSync('framework/appScriptTemplate.js', 'utf8'), values, null, ['/*', '*/']));
console.log('Built app script.')
