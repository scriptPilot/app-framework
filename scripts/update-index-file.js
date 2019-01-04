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

// Read index file template
const templateFile = path.templates('index.html');
let templateFileContent = '';
try {
  templateFileContent = fs.readFileSync(templateFile, { encoding: 'utf-8' });
  log.success('Read index.html template file.');
} catch (e) {
  log.error('Failed to read index.html template file.');
}

// Replace variables in index file
const variables = {
  language: config.meta.language,
  androidThemeColor: config.android.themeColor,
  description: config.meta.description,
  name: config.meta.name,
  relatedITunesApplicationID: config.ios.relatedITunesApplicationID,
};
let indexFileContent = templateFileContent;
Object.keys(variables).forEach((key) => {
  const re = new RegExp(`\\{${key}\\}`, 'g');
  indexFileContent = indexFileContent.replace(re, variables[key]);
});

// Update index.html file
const indexFile = path.cache('index.html');
try {
  fs.writeFileSync(indexFile, indexFileContent);
  log.success('Updated index.html file.');
} catch (e) {
  log.error('Failed to update index.html file.');
}
