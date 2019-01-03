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

// Read manifest file template
const templateFile = path.templates('manifest.webmanifest');
let templateFileContent = '';
try {
  templateFileContent = fs.readFileSync(templateFile, { encoding: 'utf-8' });
  log.success('Read manifest.webmanifest template file.');
} catch (e) {
  log.error('Failed to read manifest.webmanifest template file.');
}

// Replace variables in manifest file
const variables = {
  name: config.meta.name,
  shortName: config.meta.shortName,
  description: config.meta.description,
  androidBackgroundColor: config.frontend.android.backgroundColor,
  androidThemeColor: config.frontend.android.themeColor,
  relatedPlayStoreApplicationID: config.frontend.android.relatedPlayStoreApplicationID,
};
let manifestFileContent = templateFileContent;
Object.keys(variables).forEach((key) => {
  const re = new RegExp(`\\{${key}\\}`, 'g');
  manifestFileContent = manifestFileContent.replace(re, variables[key]);
});

// Update manifest file
const manifestFile = path.cache('manifest.webmanifest');
try {
  fs.writeFileSync(manifestFile, manifestFileContent);
  log.success('Updated manifest.webmanifest file.');
} catch (e) {
  log.error('Failed to update manifest.webmanifest file.');
}
