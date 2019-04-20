// Import modules
const fs = require('fs-extra');
const express = require('express');
const opn = require('opn');
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
if (!config.pwa.buildOnBuildCommand
    && !config.ios.buildOnBuildCommand
    && !config.android.buildOnBuildCommand) {
  log.warning('Build disabled in configuration for PWA, iOS and Android.');
  process.exit(0);
}

// Define scripts to run
const scripts = [];
scripts.push('fix-app-config');
if (config.eslint.runOnBuildCommand) scripts.push('test-eslint');
if (config.jest.runOnBuildCommand) scripts.push('test-jest');
scripts.push('build-icons');
scripts.push('build-web');
if (config.ios.buildOnBuildCommand || config.android.buildOnBuildCommand) {
  scripts.push('install-capacitor');
  scripts.push('update-capacitor-config');
}
if (config.pwa.buildOnBuildCommand) scripts.push('build-pwa');
if (config.ios.buildOnBuildCommand) scripts.push('build-ios');
if (config.android.buildOnBuildCommand) scripts.push('build-android');

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

// Open PWA (later scripts are blocked because script will not exit)
if (config.pwa.buildOnBuildCommand && config.pwa.openInBrowserAfterBuild) {
  const app = express();
  app.use('/', express.static(path.project('pwa')));
  app.listen('1337', '127.0.0.1');
  opn('http://127.0.0.1:1337');
}
