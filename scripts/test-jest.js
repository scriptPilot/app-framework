const path = require('path');
const opn = require('opn');
const fs = require('fs-extra');
const run = require('./helper/run');
const log = require('./helper/logger');

const logFileName = 'Jest.log.html';
const logFile = path.project(logFileName);
const jestConfigFile = path.project('.jestconfig.json');
const appConfigFile = path.app('config.json');

const appConfig = fs.readJsonSync(appConfigFile);

const scriptResult = run.silent(`npx jest --config "${jestConfigFile}"`);
if (scriptResult.code === 0) {
  log.success('Passed Jest tests.');
  if (appConfig.jest.openReportWhenPassed) {
    opn(logFile, { wait: false });
  } else {
    fs.remove(logFile);
  }
} else if (scriptResult.search(/No tests found/) !== -1) {
  log.info('Skipped Jest tests, no specs found.');
  fs.remove(logFile);
} else {
  if (appConfig.jest.openReportWhenFailed) {
    opn(logFile, { wait: false });
  } else {
    fs.remove(logFile);
  }
  log.error(`Failed Jest tests. Please open ${logFileName} for details.`);
}
