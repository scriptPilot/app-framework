// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

// Read main file template
const templateFile = path.templates('main.js');
let templateFileContent = '';
try {
  templateFileContent = fs.readFileSync(templateFile, { encoding: 'utf-8' });
  log.success('Read main.js template file.');
} catch (e) {
  log.error('Failed to read main.js template file.');
}

// Replace paths
const relativeAppFolderPath = path.relative(path.cache(), path.app());
const mainFileContent = templateFileContent.replace('./app/', `${relativeAppFolderPath}/`);

// Update main.js file
const mainFile = path.cache('main.js');
try {
  fs.writeFileSync(mainFile, mainFileContent);
  log.success('Updated main.js file.');
} catch (e) {
  log.error('Failed to update main.js file.');
}
