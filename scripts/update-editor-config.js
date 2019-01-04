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
const editorConfigFile = path.project('.editorconfig');
const editorDefaultConfig = [
  '[*]',
  'charset = utf-8',
  'end_of_line = lf',
  'insert_final_newline = true',
  'indent_style = space',
  'indent_size = 2',
  'max_line_length = 100',
];

// Merge with app configuration
const editorConfig = editorDefaultConfig.concat(config.editorconfig.addLinesToConfigFile);

// Update .editorconfig file
try {
  fs.writeFileSync(editorConfigFile, editorConfig.join('\n'));
  log.success('Updated the .editorconfig file.');
} catch (e) {
  log.error('Failed to update the .editorconfig file.');
}
