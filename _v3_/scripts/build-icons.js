// Import modules
const fs = require('fs-extra');
const jimp = require('jimp');
const pngToIco = require('png-to-ico');
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
  // Empty cache folder
  fs.emptyDirSync(path.cache('icons'));
  // Build favicon (not in PWA to use hash and better update of changed icons
  // and favicon on dev server)
  await pngToIco(path.app(config.pwa.iconFile))
    .then((icoFile) => {
      fs.outputFileSync(path.cache('icons/favicon.ico'), icoFile);
      log.success('Created the favicon file.');
    })
    .catch(() => {
      log.error('Failed to cretate the favicon file.');
    });
  // Build PWA icons
  if (config.pwa.buildOnBuildCommand) {
    try {
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
