let json = require('./lib/json')
let alert = require('./lib/alert')
let fs = require('fs')

let src = './demo-app-config-scheme.json'
let configFile = './demo-app/src/config.json'
let docuFile = './docs/configuration-options.md'

alert('Demo App config update ongoing - please wait ...')
let update = json.create(src, configFile)
if (update === true) {
  alert('Demo App config documentation update ongoing - please wait ...')
  let configDocu = json.docu(src)
  let docuText = fs.readFileSync(docuFile, 'utf-8')
  docuText = docuText.replace(/<!-- update-on-build -->([\s\S.]*)<\!-- \/update-on-build -->/, '<!-- update-on-build -->' + "\n" + configDocu + '<!-- /update-on-build -->')
  fs.writeFileSync(docuFile, docuText)
  alert('Demo App config documentation update done.')
} else {
  alert(update)
}
