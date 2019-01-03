// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Add Android project folder
const androidProjectFolder = path.project('android');
if (fs.pathExistsSync(androidProjectFolder)) {
  log.info('Android project folder already exists.');
} else {
  log.warning('Adding Android project folder - this may take a while ...');
  const addAndroidScript = run.loud('npx cap add android');
  if (addAndroidScript.code === 0) log.success('Added Android project folder.');
  else log.error('Failed to add Android project folder.');
}

// Updating the Android folder
log.warning('Updating the Android project folder - this may take a while ...');
const updateScript = run.loud('npx cap sync android');
if (updateScript.code === 0) log.success('Updated the Android project folder.');
else log.error('Failed to update the Android project folder.');

// Open Xcode
run.loud('npx cap open android');
