// Import modules
const fs = require('fs-extra');
const jimp = require('jimp');
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

// Build icons
const buildIcons = async () => {
  // Build PWA icons
  if (config.pwa.buildOnBuildCommand) {
    try {
      // Empty cache folder
      fs.emptyDirSync(path.cache('icons/pwa'));
      // Create PWA icons
      let image;
      image = await jimp.read(path.app(config.pwa.iconFile));
      image.resize(512, 512).write(path.cache('icons/pwa/icon-512px.png'));
      image = await jimp.read(path.app(config.pwa.iconFile));
      image.resize(192, 192).write(path.cache('icons/pwa/icon-192px.png'));
      image = await jimp.read(path.app(config.pwa.iconFile));
      image.resize(180, 180).write(path.cache('icons/pwa/apple-touch-icon.png'));
      // Log success
      log.success('Created PWA icons.');
    } catch (e) {
      log.debug(e);
      log.error('Failed to create PWA icons.');
    }
  }
};
buildIcons();
