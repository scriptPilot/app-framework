// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// Default value
const file = path.project('.gitignore');
const toBeIgnored = [
  '# System Files',
  '.DS_Store',
  '',
  '# Log Files',
  '*.log*',
  '',
  '# Generated Files',
  '.cache/',
  '.git/',
  'pwa',
  'ios',
  'android',
  'node_modules/',
  '*.tgz',
  '.editorconfig',
  '.enableDevelopmentMode',
  '.eslintrc.json',
  '.gitignore',
  '.jestconfig.json',
  'capacitor.config.json',
];

// Merge with app configuration
const gitignoreConfig = toBeIgnored.concat(config.git.addLinesToIgnoreFile);

// Update .gitignore file
try {
  fs.writeFileSync(file, gitignoreConfig.join('\n'));
  log.success('Updated the .gitignore file.');
} catch (e) {
  log.error('Failed to update the .gitignore file.');
}
