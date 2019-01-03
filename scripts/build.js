const fs = require('fs-extra');
const run = require('./helper/run');
const path = require('./helper/path');
const log = require('./helper/logger');

const config = fs.readJsonSync(path.app('config.json'));

const scripts = [];

if (config.test.eslint.runBeforeBuild) scripts.push('test-eslint');
if (config.test.jest.runBeforeBuild) scripts.push('test-jest');

scripts.push('build-icons');
scripts.push('build-web');
scripts.push('build-pwa');
scripts.push('build-ios');

const runNextScript = () => {
  if (scripts.length > 0) {
    log.debug('run next');
    const scriptResult = run.script(scripts.shift());
    if (scriptResult.code === 0) runNextScript();
    else log.error('Failed to complete build routine.');
  } else {
    log.success('Completed build routine.');
  }
};

runNextScript();
