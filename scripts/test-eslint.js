const path = require('path');
const opn = require('opn');
const fs = require('fs-extra');
const run = require('./helper/run');
const log = require('./helper/logger');

const logFileName = 'ESLint.log.html';
const logFile = path.project(logFileName);
const cacheFile = path.cache('eslint/.eslintcache');
const appConfigFile = path.app('config.json');

const appConfig = fs.readJsonSync(appConfigFile);
const configFile = path.project('.eslintrc.json');

const scriptResult = run.loud(`
  npx eslint "${path.project()}"
  --ignore-pattern "/node_modules/"
  --ignore-pattern "/pwa/"
  --ignore-pattern "/ios/"
  --ignore-pattern "/android/"
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
  if (appConfig.test.eslint.keepReportWhenPassed) {
    opn(logFile, { wait: false });
  } else {
    fs.remove(logFile);
  }
  log.success('Passed ESLint test.');
} else {
  opn(logFile, { wait: false });
  log.error(`Failed ESLint test. Please open ${logFileName} for details.`);
}
