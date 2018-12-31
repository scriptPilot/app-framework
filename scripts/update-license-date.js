const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

const file = path.project('LICENSE');
if (fs.pathExistsSync(file)) {
  const year = (new Date()).getFullYear()
  const oldFileContent = fs.readFileSync(file, { encoding: 'utf-8' })
  const newFileContent = oldFileContent.replace(/([0-9]{4}-)?[0-9]{4}/, '$1' + year)
  if (oldFileContent !== newFileContent) {
    fs.writeFileSync(file, newFileContent)
    log.success('Updated date in LICENSE file.')
  } else {
    log.info('LICENSE file date is up to date.')
  }
}
