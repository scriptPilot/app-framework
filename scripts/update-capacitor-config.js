const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

// Read app config
const config = fs.readJsonSync(path.app('config.json'));

// Create Capacitor config object
const capConfig = {
  appId: config.meta.appID,
  appName: config.meta.shortName,
  bundledWebRuntime: false,
  webDir: path.cache('web'),
};

// Update Capacitor config file
try {
  fs.outputJsonSync(path.project('capacitor.config.json'), capConfig, { spaces: 2 });
  log.success('Updated the Capacitor configuration file.');
} catch (e) {
  log.error('Failed to update the Capacitor configuration file.');
}
