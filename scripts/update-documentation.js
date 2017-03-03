'use strict'

let json = require('../lib/json')
let alert = require('../lib/alert')
let fs = require('fs')
let abs = require('path').resolve

let cfg = require('./config')

if (cfg.isInstalled) {
  alert('This script is only for App Framework development purposes.')
} else {
  let src = abs(cfg.packageRoot, 'config-scheme.json')
  let configFile = abs(cfg.appRoot, 'config.json')
  let docuFile = abs(cfg.packageRoot, 'DOCUMENTATION.md')

  alert('Demo App config update ongoing - please wait ...')
  let update = json.create(src, configFile)
  if (update === true) {
    alert('Demo App config documentation update ongoing - please wait ...')
    let configDocu = json.docu(src, 'table')
    let docuText = fs.readFileSync(docuFile, 'utf-8')
    docuText = docuText.replace(/<!-- update-on-build -->([\s\S.]*)<!-- \/update-on-build -->/, '<!-- update-on-build -->' + '\n' + configDocu + '<!-- /update-on-build -->')
    fs.writeFileSync(docuFile, docuText)
    alert('Demo App config documentation update done.')
  } else {
    alert(update)
  }
}
