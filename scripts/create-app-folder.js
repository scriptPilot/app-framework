const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

const sourceFolder = path.framework('templates/app');
const destFolder = path.app();

if (path.project() === path.framework()) {
  log.info('Skipped the app folder creation.');
} else if (fs.pathExistsSync(destFolder)) {
  log.info('Found app folder.');
} else {
  fs.copySync(sourceFolder, destFolder);
  log.success('Created app folder.');
}
