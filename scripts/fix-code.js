/* Purpose: Fix code and open report of issues which must be fixed manually */

// Import modules
const path = require('path');
const opn = require('opn');
const fs = require('fs-extra');
const run = require('../helpers/run');
const log = require('../helpers/logger');

// Define constants
const logFileName = 'ESLint.log.html';
const logFile = path.project(logFileName);
const cacheFile = path.cache('eslint/.eslintcache');
const appConfigFile = path.app('config.json');

const appConfig = fs.readJsonSync(appConfigFile);
const configFile = path.project('.eslintrc.json');

// Update ESLint config
// if (run.script('update-eslint-config').code !== 0) process.exit(1);

// Run ESLint
const scriptResult = run.silent(`
  npx eslint "${path.framework()}"
  --ignore-pattern "/node_modules/"
  --ext .js
  --ext .vue
  --fix
  --config "${configFile}"
  --output-file "${logFile}"
  --format html
  --cache
  --cache-location "${cacheFile}"
`.replace(/\n/g, ' '));
if (scriptResult.code === 0) {
  if (appConfig.eslint.openReportWhenPassed) {
    opn(logFile, { wait: false });
  } else {
    fs.remove(logFile);
  }
  log.success('Passed ESLint test.');
} else {
  if (appConfig.eslint.openReportWhenFailed) {
    opn(logFile, { wait: false });
  } else {
    fs.remove(logFile);
  }
  log.error(`Failed ESLint test. Please open ${logFileName} for details.`);
}
