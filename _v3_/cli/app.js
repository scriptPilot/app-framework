#!/usr/bin/env node

// Import modules
const program = require('commander');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const log = require('../scripts/helper/logger');
const path = require('../scripts/helper/path');
const run = require('../scripts/helper/run');
const { version } = require('../package.json');

// Check if App Framework was cloned and no .enableDevelopmentMode file exists
if (path.project() === path.framework() && !fs.pathExistsSync(path.project('.enableDevelopmentMode'))) {
  log.error(`
    App Framework should be installed as a Node package - not beeing cloned.
    To contribute to App Frameworkwork itself, please activate the development mode.
    Please read the documentation for details.
  `);
}

// Define default programs
program
  .version(version, '-v --version');
program
  .command('test [name]')
  .description('run tests according configuration')
  .action((name) => {
    if (name === undefined) {
      run.script('test');
    } else if (name === 'eslint') {
      run.script('test-eslint');
    } else if (name === 'jest') {
      run.script('test-jest');
    } else {
      log.error('Allowed names are "eslint" and "jest" only.');
    }
  });
program
  .command('dev')
  .description('open app on development server with hot-reload')
  .action(() => {
    run.script('dev');
  });
program
  .command('build')
  .description('build application according configuration')
  .action(() => {
    run.script('build');
  });
program
  .command('deploy <target>')
  .description('deploy application to the target (ftp or firebase)')
  .action((target) => {
    if (target === 'ftp') {
      execSync('node ./deploy-ftp.js', { cwd: path.scripts(), stdio: 'inherit' });
    } else if (target === 'firebase') {
      execSync('node ./deploy-firebase.js', { cwd: path.scripts(), stdio: 'inherit' });
    } else {
      log.error('Allowed targets are "ftp" and "firebase" only.');
    }
  });

// Define development programs
if (path.framework() === path.project()) {
  program
    .command('update-f7')
    .description('update Framework7 demo files')
    .action(() => {
      run.script('update-framework7-demo-files');
    });
}

// Parse program
program.parse(process.argv);
