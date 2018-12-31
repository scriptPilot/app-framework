const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('./helper/path');
const log = require('./helper/logger');

const fileName = 'ESLint.log.html';
const logFile = path.project(fileName);
const cacheFolder = path.cache('eslint');

const testResult = shell.exec(`npx eslint . --ext .js --ext .vue --fix --output-file "${logFile}" --format html --cache --cache-location "${cacheFolder}"`);
if (testResult.code === 0) {
  log.success('ESLint test passed.');
  fs.removeSync(logFile);
} else {
  log.error(`ESLint test failed. Please check the ${fileName} file.`);
}
