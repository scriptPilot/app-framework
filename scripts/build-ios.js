// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// Add iOS project folder
const iosProjectFolder = path.project('ios');
if (fs.pathExistsSync(iosProjectFolder)) {
  log.info('iOS project folder already exists.');
} else {
  log.warning('Adding iOS project folder - this may take a while ...');
  const addIOSScript = run.silent('npx cap add ios');
  if (addIOSScript.code === 0) log.success('Added iOS project folder.');
  else log.error('Failed to add iOS project folder.');
}

// Updating the iOS folder
log.warning('Updating the iOS project folder - this may take a while ...');
const updateScript = run.silent('npx cap sync ios');
if (updateScript.code === 0) log.success('Updated the iOS project folder.');
else log.error('Failed to update the iOS project folder.');

// Open Xcode
if (config.ios.openXcodeAfterBuild) run.silent('npx cap open ios');
