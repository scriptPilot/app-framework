// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const merge = require('./helper/merge');

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// Set default values
const eslintConfigFile = path.project('.eslintrc.json');
const defaultConfig = {
  extends: [
    'airbnb-base',
    'plugin:vue/base',
    'plugin:jest/recommended',
  ],
};

// Merge default with app config
const eslintConfig = merge(defaultConfig, config.eslint.extendDefaultConfig);

// Update .eslintrc.json file
try {
  fs.writeJsonSync(eslintConfigFile, eslintConfig, { spaces: 2 });
  log.success('Updated the .eslintrc.json file.');
} catch (e) {
  log.error('Failed to update the .eslintrc.json file.');
}
