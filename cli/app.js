#!/usr/bin/env node

// Import modules
const program = require('commander');
const fs = require('fs-extra');
const log = require('../scripts/helper/logger');
const path = require('../scripts/helper/path');
const { version } = require('../package.json');

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
} catch (e) {
  log.error('Failed to load app config file.');
}

// Check if App Framework is installed or if developmentMode is enabled
if (path.project() === path.framework() && config.developmentMode === false) {
  log.error(`
    App Framework should be installed from NPMjs.com.
    To contribute to App Frameworkwork itself, please activate the development mode.
    Please check the documenttaion for the next steps.
  `);
}

// CLI definition
program
  .version(version, '-v --version')
  .command('test', 'run one or more tests')
  .command('dev', 'start development server')
  .command('build', 'build application')
  .parse(process.argv);
