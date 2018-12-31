const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

const isInstalled = path.project() !== path.framework();

// Read file content
const file = path.project('package.json');
const content = fs.readJsonSync(file);

// Add missing name
if (content.name === undefined) content.name = path.basename(path.project());

// Add missing version
if (content.version === undefined) content.version = '1.0.0';

// Update scripts
const prefix = `node ./${isInstalled ? 'node_modules/app-framework/' : ''}scripts/`;
const scriptArr = [
  'postinstall',
  'test-eslint',
  'dev',
  'build',
];
const scriptObj = {};
scriptArr.forEach((script) => {
  scriptObj[script] = prefix + script;
});
content.scripts = scriptObj;

// Write updated content
fs.writeJsonSync(file, content, { spaces: 2 });
log.success('Updated the package file.');
