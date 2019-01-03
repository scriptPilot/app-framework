// Import modules
const fs = require('fs-extra');
const run = require('./helper/run');
const path = require('./helper/path');
const log = require('./helper/logger');

// Load app configuration
let config = {};
try {
  config = fs.readJsonSync(path.app('config.json'));
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// No build targets configured warning
if (!config.build.pwa && !config.build.ios && !config.build.android) {
  log.warning('Build disabled in configuration for PWA, iOS and Android.');
  process.exit(0);
}

// Define scripts to run
const scripts = [];
if (config.test.eslint.runBeforeBuild) scripts.push('test-eslint');
if (config.test.jest.runBeforeBuild) scripts.push('test-jest');
scripts.push('build-icons');
scripts.push('build-web');
if (config.build.ios || config.build.android) {
  scripts.push('install-capacitor');
  scripts.push('update-capacitor-config');
}
if (config.build.pwa) scripts.push('build-pwa');
if (config.build.ios) scripts.push('build-ios');
if (config.build.android) scripts.push('build-android');

// Run scripts
const runNextScript = () => {
  if (scripts.length > 0) {
    const scriptResult = run.script(scripts.shift());
    if (scriptResult.code === 0) runNextScript();
    else log.error('Failed to complete build routine.');
  }
};
runNextScript();

log.success('Completed the build routine.');
