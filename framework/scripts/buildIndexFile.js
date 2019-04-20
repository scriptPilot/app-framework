const { readFileSync, outputFileSync, readJsonSync } = require('fs-extra')
const mustache = require('mustache')

const config = readJsonSync('app/config.json')
const values = {
  name: config.meta.name
}
outputFileSync('cache/index.html', mustache.render(readFileSync('framework/indexFileTemplate.html', 'utf8'), values, null, ['<!--', '-->']));
console.log('Built index file.')
