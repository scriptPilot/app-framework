// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Install Cacpacitor Core
const CorePath = path.project('node_modules/@capacitor/core');
if (fs.pathExistsSync(CorePath)) {
  log.info('Capacitor Core already installed.');
} else {
  log.warning('Installing Capacitor Core - this may take a while ...');
  const installScript = run.silent('npm install @capacitor/core');
  if (installScript.code === 0) log.success('Installed Capacitor Core.');
  else log.error('Failed to install Capacitor Core');
}

// Install Cacpacitor CLI
const cliPath = path.project('node_modules/@capacitor/cli');
if (fs.pathExistsSync(cliPath)) {
  log.info('Capacitor CLI already installed.');
} else {
  log.warning('Installing Capacitor CLI - this may take a while ...');
  const installScript = run.silent('npm install @capacitor/cli');
  if (installScript.code === 0) log.success('Installed Capacitor CLI.');
  else log.error('Failed to install Capacitor CLI');
}
