const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

const sourceFolder = path.framework('templates/app');
const destFolder = path.app();

if (path.project() === path.framework()) {
  log.info('App folder creation skipped.');
} else if (fs.pathExistsSync(destFolder)) {
  log.info('App folder already exists.');
} else {
  fs.copySync(sourceFolder, destFolder);
  log.success('App folder created.');
}
