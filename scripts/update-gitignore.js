const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

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
  'node_modules/',
  '.eslintrc.json',
  '.gitignore',
];

fs.writeFileSync(file, toBeIgnored.join('\n'));
log.success('.gitignore file updated.');
