const path = require('path');
const opn = require('opn');
const fs = require('fs-extra');
const { exec } = require('shelljs');
const log = require('./helper/logger');

const logFileName = 'ESLint.log.html';
const logFile = path.project(logFileName);
const cacheFile = path.cache('eslint/.eslintcache');
const appConfigFile = path.app('config.json');

const appConfig = fs.readJsonSync(appConfigFile);
const configFile = path.project('.eslintrc.json');

exec(`npx eslint "${path.project()}" --ignore-pattern "/node_modules/" --ext .js --ext .vue --fix --config "${configFile}" --output-file "${logFile}" --format html --cache --cache-location "${cacheFile}"`, { cwd: path.project(), silent: true }, (error) => {
  if (error) {
    opn(logFile, { wait: false });
    log.error(`Failed ESLint test. Please open ${logFileName} for details.`);
  } else {
    if (appConfig.test.eslint.keepReportWhenPassed) {
      opn(logFile, { wait: false });
    } else {
      fs.remove(logFile);
    }
    log.success('Passed ESLint test.');
  }
});
