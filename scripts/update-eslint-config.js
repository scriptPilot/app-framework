const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const merge = require('./helper/merge');

const defaultConfig = {
  extends: [
    'airbnb-base',
    'plugin:vue/base',
    'plugin:jest/recommended',
  ],
};

const userConfig = fs.readJsonSync(path.app('config.json')).test.eslint.ownConfig;

const mergedConfig = merge(defaultConfig, userConfig);

const file = path.project('.eslintrc.json');
fs.writeJsonSync(file, mergedConfig, { spaces: 2 });
log.success('Updated the ESLint config file.');
