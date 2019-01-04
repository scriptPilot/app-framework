// Load modules
const fs = require('fs-extra');
const find = require('find');
const path = require('./helper/path');
const log = require('./helper/logger');

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

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
  log.success('Read index.html template file.');
} catch (e) {
  log.error('Failed to read index.html template file.');
}
const manifestTag = '<link rel="manifest" href="./manifest.webmanifest" />';
const newIndexFileContent = indexFileContent.replace('</head>', `${manifestTag}</head>`);
try {
  fs.writeFileSync(indexFile, newIndexFileContent);
  log.success('Added manifest tag to index.html file.');
} catch (e) {
  log.error('Failed to add manifest tag to index.html file.');
}

// Add service worker
if (config.pwa.includeOfflineServiceWorker) {
  // Find main.js file (with hash in the middle)
  const mainFileSearchResults = find.fileSync(/main\.(.+)\.js/, path.cache('pwa'));
  if (mainFileSearchResults.length !== 1) log.error('Failed to find main.js file.');
  const mainFile = mainFileSearchResults[0];
  // Add installation script to main.js file
  let mainFileContent = '';
  try {
    mainFileContent = fs.readFileSync(mainFile, { encoding: 'utf-8' });
    log.success('Read main.js template file.');
  } catch (e) {
    log.error('Failed to read main.js template file.');
  }
  const serviceWorkerInstallationScript = `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
      })
    }
  `;
  const newMainFileContent = `${mainFileContent}\n${serviceWorkerInstallationScript}`;
  try {
    fs.writeFileSync(mainFile, newMainFileContent);
    log.success('Added service worker installation script to main.js file.');
  } catch (e) {
    log.error('Failed to add service worker installation script to main.js file.');
  }
  // Move service worker file in main cache folder
  try {
    fs.moveSync(path.cache('sw.js'), path.cache('pwa/sw.js'), { overwrite: true });
    log.success('Moved service worker to pwa cache folder.');
  } catch (e) {
    log.error('Failed to move service worker to pwa cache folder.');
  }
} else {
  log.info('Skipped offline service worker creation according configuration.');
}

// Replace build files
const buildFolder = path.project('pwa');
try {
  fs.removeSync(buildFolder);
  fs.copySync(cacheFolder, buildFolder);
  log.success('Copied PWA build files to folder /pwa');
} catch (e) {
  log.error('Failed to copy PWA build files to folder /pwa');
}
