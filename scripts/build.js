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

if (config.build.pwa) scripts.push('build-pwa');
if (config.build.ios) scripts.push('build-ios');
if (config.build.android) scripts.push('build-android');

if (!config.build.pwa && !config.build.ios && !config.build.android) {
  log.warning('Build disabled in configuration for PWA, iOS and Android.');
  process.exit(0);
}

const runNextScript = () => {
  if (scripts.length > 0) {
    const scriptResult = run.script(scripts.shift());
    if (scriptResult.code === 0) runNextScript();
    else log.error('Failed to complete build routine.');
  } else {
    log.success('Completed build routine.');
  }
};

runNextScript();
