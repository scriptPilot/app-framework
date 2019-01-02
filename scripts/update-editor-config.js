const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

const defaultConfig = [
  '[*]',
  'charset = utf-8',
  'end_of_line = lf',
  'insert_final_newline = true',
  'indent_style = space',
  'indent_size = 2',
];

const userConfig = fs.readJsonSync(path.app('config.json')).development.editorConfig.ownConfig;

const mergedConfig = defaultConfig.concat(userConfig);

const file = path.project('.editorconfig');
fs.writeFileSync(file, `${mergedConfig.join('\n')}\n`);
log.success('Updated the Editor config file.');
