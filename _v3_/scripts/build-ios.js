// Import modules
const fs = require('fs-extra');
const jimp = require('jimp');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// Add iOS project folder
const iosProjectFolder = path.project('ios');
if (fs.pathExistsSync(iosProjectFolder)) {
  log.info('iOS project folder already exists.');
} else {
  log.warning('Adding iOS project folder - this may take a while ...');
  const addIOSScript = run.silent('npx cap add ios');
  if (addIOSScript.code === 0) log.success('Added iOS project folder.');
  else log.error('Failed to add iOS project folder.');
}

// Updating the iOS folder
log.warning('Updating the iOS project folder - this may take a while ...');
const updateScript = run.silent('npx cap sync ios');
if (updateScript.code === 0) log.success('Updated the iOS project folder.');
else log.error('Failed to update the iOS project folder.');

// Create icons, splash screens and open Xcode
const createIconsAndSplashScreensAndOpenXcode = async () => {
  try {
    // Sleep function as helper (last file otherwise locked for copying)
    const sleep = ms => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    // Create icons
    const iosIconFolder = path.project('ios/App/App/Assets.xcassets/AppIcon.appiconset');
    const iosIconCacheFolder = path.cache('icons/ios');
    const createIcons = async () => {
      log.warning('Creating iOS icons - this may take a while ...');
      // Read Contents.json
      const contents = fs.readJsonSync(path.resolve(iosIconFolder, 'Contents.json'));
      // Empty cache folder
      fs.emptyDirSync(iosIconCacheFolder);
      // Loop Contents.json
      // eslint-disable-next-line no-restricted-syntax
      for (const imageInfo of contents.images) {
        const size = Number(imageInfo.size.split('x')[0]);
        const factor = Number(imageInfo.scale.replace('x', ''));
        const realSize = size * factor;
        // eslint-disable-next-line no-await-in-loop
        const image = await jimp.read(path.app(config.ios.iconFile));
        // eslint-disable-next-line no-await-in-loop
        await image.resize(realSize, realSize)
          .write(path.resolve(iosIconCacheFolder, imageInfo.filename));
        log.success(`Icon ${imageInfo.filename} created`);
      }
    };
    await createIcons();
    // Copy icons
    await sleep(500);
    fs.copySync(iosIconCacheFolder, iosIconFolder);
    // Log success
    log.success('Created iOS icons.');
    // Create splash screens
    const iosSplashFolder = path.project('ios/App/App/Assets.xcassets/Splash.imageset');
    const iosSplashCacheFolder = path.cache('icons/ios-splash');
    const createSplash = async () => {
      log.warning('Creating iOS splash screens - this may take a while ...');
      // Read Contents.json
      const contents = fs.readJsonSync(path.resolve(iosSplashFolder, 'Contents.json'));
      // Empty cache folder
      fs.emptyDirSync(iosSplashCacheFolder);
      // Loop Contents.json
      // eslint-disable-next-line no-restricted-syntax
      for (const imageInfo of contents.images) {
        const canvasSize = Number(imageInfo.filename.match(/[0-9]{3,4}/g)[0]);
        // eslint-disable-next-line no-await-in-loop, new-cap
        const canvas = await new jimp(
          canvasSize,
          canvasSize,
          config.ios.splashScreenBackgroundColor,
        );
        // eslint-disable-next-line no-await-in-loop
        const icon = await jimp.read(path.app(config.ios.splashScreenIconFile));
        const iconSize = canvasSize * 0.2;
        // eslint-disable-next-line no-await-in-loop
        await icon.resize(iconSize, iconSize);
        canvas.composite(icon, 0.4 * canvasSize, 0.4 * canvasSize)
          .write(path.resolve(iosSplashCacheFolder, imageInfo.filename));
        log.success(`Splash screen ${imageInfo.filename} created`);
      }
    };
    await createSplash();
    // Copy splash screens
    await sleep(500);
    fs.copySync(iosSplashCacheFolder, iosSplashFolder);
    // Log success
    log.success('Created iOS splash screens.');
    // Open Xcode
    if (config.ios.openXcodeAfterBuild) run.silent('npx cap open ios');
  } catch (e) {
    log.error('Failed to create iOS icons and splash screens.');
  }
};
createIconsAndSplashScreensAndOpenXcode();
