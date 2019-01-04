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

// Check if App Framework was cloned and no .enableDevelopmentMode file exists
if (path.project() === path.framework() && !fs.pathExistsSync(path.project('.enableDevelopmentMode'))) {
  log.error(`
    App Framework should be installed as a Node package - not beeing cloned.
    To contribute to App Frameworkwork itself, please activate the development mode.
    Please read the documentation for details.
  `);
}

// CLI definition
program
  .version(version, '-v --version')
  .command('test', 'run one or more tests')
  .command('dev', 'start development server')
  .command('build', 'build application')
  .parse(process.argv);
