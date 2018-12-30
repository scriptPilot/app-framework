const shell = require('shelljs');
const fs = require('fs-extra');
const opn = require('opn');
const path = require('./helper/path');
const log = require('./helper/logger');

const fileName = 'ESLint.log.html';
const logFile = path.project(fileName);
const cacheFile = path.cache('eslint/.eslintcache');

const testResult = shell.exec(`npx eslint . --ext .js --ext .vue --fix --output-file "${logFile}" --format html --cache --cache-location "${cacheFile}"`);
if (testResult.code === 0) {
  log.success('Passed ESLint test.');
  fs.removeSync(logFile);
} else {
  opn(logFile);
  log.error(`Failed ESLint test. Please check the ${fileName} file.`);
}
