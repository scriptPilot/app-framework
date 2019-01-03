// Load modules
const fs = require('fs-extra');
const path = require('./helper/path');
const run = require('./helper/run');
const log = require('./helper/logger');

// Define cache folder
const cacheFolder = path.cache('pwa');

// Empty cache folder
try {
  fs.emptyDirSync(cacheFolder);
  log.success('Emptied PWA build cache folder.');
} catch (e) {
  log.error('Failed to empty PWA build cache folder.');
}

// Copy web build files
try {
  fs.copySync(path.cache('web'), cacheFolder);
  log.success('Copied web build files.');
} catch (e) {
  log.error('Failed to copy web build files.');
}

// Copy robots.txt file
try {
  fs.copySync(path.templates('robots.txt'), path.resolve(cacheFolder, 'robots.txt'));
  log.success('Copied robots.txt file.');
} catch (e) {
  log.error('Failed to copy robots.txt file.');
}

// Copy .htaccess file
try {
  fs.copySync(path.templates('.htaccess'), path.resolve(cacheFolder, '.htaccess'));
  log.success('Copied .htaccess file.');
} catch (e) {
  log.error('Failed to copy .htaccess file.');
}

// Add manifest tag to index.html file
const indexFile = path.resolve(cacheFolder, 'index.html');
let indexFileContent = '';
try {
  indexFileContent = fs.readFileSync(indexFile, { encoding: 'utf-8' });
  log.success('Read main.js template file.');
} catch (e) {
  log.error('Failed to read main.js template file.');
}
const manifestTag = '<link rel="manifest" href="./manifest.webmanifest" />';
const newIndexFileContent = indexFileContent.replace('</head>', `${manifestTag}</head>`);
try {
  fs.writeFileSync(indexFile, newIndexFileContent);
  log.success('Added manifest tag to index.html file.');
} catch (e) {
  log.error('Failed to add manifest tag to index.html file.');
}

// Install Capacitor
if (run.script('install-capacitor').code !== 0) process.exit(1);

// Update Capacitor configuration
if (run.script('update-capacitor-config').code !== 0) process.exit(1);

// Replace build files
const buildFolder = path.project('pwa');
try {
  fs.removeSync(buildFolder);
  fs.copySync(cacheFolder, buildFolder);
  log.success('Copied PWA build files to folder /pwa');
} catch (e) {
  log.error('Failed to copy PWA build files to folder /pwa');
}
