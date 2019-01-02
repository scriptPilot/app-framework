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
run.silent(`npx jest --config "${jestConfigFile}"`, (error, stdout) => {
  if (error && stdout.search(/No tests found/) !== -1) {
    log.info('Skipped Jest tests, no specs found.');
    fs.remove(logFile);
  } else if (error) {
    opn(logFile, { wait: false });
    log.error(`Failed Jest tests. Please open ${logFileName} for details.`);
  } else {
    log.success('Passed Jest tests.');
    if (appConfig.test.jest.keepReportWhenPassed) {
      opn(logFile, { wait: false });
    } else {
      fs.remove(logFile);
    }
  }
});
