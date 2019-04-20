const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

// Read app config
const config = fs.readJsonSync(path.app('config.json'));

// Create Capacitor config object
// Use pseudo app id to avoid errors due to invalid iOS app id
const capConfig = {
  appId: 'com.example.app',
  appName: config.meta.shortName,
  bundledWebRuntime: false,
  webDir: path.cache('web'),
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
};

// Update Capacitor config file
try {
  fs.outputJsonSync(path.project('capacitor.config.json'), capConfig, { spaces: 2 });
  log.success('Updated the Capacitor configuration file.');
} catch (e) {
  log.error('Failed to update the Capacitor configuration file.');
}
