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

// Add Android project folder
const androidProjectFolder = path.project('android');
if (fs.pathExistsSync(androidProjectFolder)) {
  log.info('Android project folder already exists.');
} else {
  log.warning('Adding Android project folder - this may take a while ...');
  const addAndroidScript = run.silent('npx cap add android');
  if (addAndroidScript.code === 0) log.success('Added Android project folder.');
  else log.error('Failed to add Android project folder.');
}

// Updating the Android folder
log.warning('Updating the Android project folder - this may take a while ...');
const updateScript = run.silent('npx cap sync android');
if (updateScript.code === 0) log.success('Updated the Android project folder.');
else log.error('Failed to update the Android project folder.');

// Create icons, splash screens and open AndroidStudio
const createIconsAndSplashScreensAndOpenAndroidStudio = async () => {
  try {
    // Sleep function as helper (last file otherwise locked for copying)
    const sleep = ms => new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    // Create icons
    const androidIconFolder = path.project('android/app/src/main/res');
    const androidIconCacheFolder = path.cache('icons/android');
    const createIcons = async () => {
      log.warning('Creating Android icons - this may take a while ...');
      // List icon sub folders
      const iconSubFolders = fs.readdirSync(path.resolve(androidIconFolder));
      // Empty cache folder
      fs.emptyDirSync(androidIconCacheFolder);
      // Loop icon sub folders
      // eslint-disable-next-line no-restricted-syntax
      for (const iconSubFolder of iconSubFolders) {
        if (iconSubFolder.match(/^mipmap-[hlmx]+dpi/)) {
          const iconFile = path.resolve(androidIconFolder, iconSubFolder, 'ic_launcher_foreground.png');
          if (fs.pathExistsSync(iconFile)) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const originalFile = await jimp.read(iconFile);
              // eslint-disable-next-line no-await-in-loop
              const maskFile = await jimp.read(path.framework('media/android-mask-round.png'));
              // eslint-disable-next-line no-await-in-loop
              const image = await jimp.read(path.app(config.android.iconFile));
              const canvasSize = originalFile.bitmap.width;
              const size = originalFile.bitmap.width * 0.7;
              const offset = (canvasSize - size) / 2;
              // eslint-disable-next-line no-await-in-loop
              await maskFile.resize(size, size);
              // eslint-disable-next-line no-await-in-loop
              await image.resize(size, size)
                .write(iconFile.replace('.png', '_new.png'));
              log.success(`Icon ${iconSubFolder}/ic_launcher_foreground.png created`);
              // eslint-disable-next-line no-await-in-loop
              await image.resize(size, size).mask(maskFile, 0, 0);
              // eslint-disable-next-line no-await-in-loop, new-cap
              const canvas = await new jimp(
                canvasSize,
                canvasSize,
              );
              // eslint-disable-next-line no-await-in-loop
              canvas.composite(image, offset, offset)
                .write(iconFile.replace('ic_launcher_foreground.png', 'ic_launcher_round.png').replace('.png', '_new.png'));
              log.success(`Icon ${iconSubFolder}/ic_launcher_round.png created`);
            } catch (e) {
              log.error(`Failed to create icon ${iconSubFolder}/ic_launcher_foreground.png.`);
            }
          }
        }
      }
    };
    await createIcons();
    // Copy icons
    await sleep(500);
    fs.copySync(androidIconCacheFolder, androidIconFolder);
    // Log success
    log.success('Created Anroid icons.');
    // Create splash screens
    const androidSplashFolder = path.project('android/app/src/main/res');
    const androidSplashCacheFolder = path.cache('icons/android-splash');
    const createSplashs = async () => {
      log.warning('Creating Android splash screens - this may take a while ...');
      // List splash sub folders
      const splashSubFolders = fs.readdirSync(path.resolve(androidSplashFolder));
      // Empty cache folder
      fs.emptyDirSync(androidSplashCacheFolder);
      // Loop splash sub folders
      // eslint-disable-next-line no-restricted-syntax
      for (const splashSubFolder of splashSubFolders) {
        if (splashSubFolder.match(/^drawable-(land|port)-/)) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const originalFile = await jimp.read(path.resolve(androidSplashFolder, splashSubFolder, 'splash.png'));
            const canvasWidth = originalFile.bitmap.width;
            const canvasHeight = originalFile.bitmap.height;
            // eslint-disable-next-line no-await-in-loop, new-cap
            const canvas = await new jimp(
              canvasWidth,
              canvasHeight,
              config.android.splashScreenBackgroundColor,
            );
            // eslint-disable-next-line no-await-in-loop
            const icon = await jimp.read(path.app(config.android.splashScreenIconFile));
            const iconSize = Math.min(canvasWidth, canvasHeight) * 0.25;
            const iconPosX = (canvasWidth - iconSize) / 2;
            const iconPosY = (canvasHeight - iconSize) / 2;
            // eslint-disable-next-line no-await-in-loop
            await icon.resize(iconSize, iconSize);
            canvas.composite(icon, iconPosX, iconPosY)
              .write(path.resolve(path.resolve(androidSplashFolder, splashSubFolder, 'splash.png')));
            log.success(`Splash screen ${splashSubFolder}/splash.png created.`);
          } catch (e) {
            log.error(`Failed to create splash screen ${splashSubFolder}/splash.png.`);
          }
        }
      }
    };
    await createSplashs();
    // Copy splash screens
    await sleep(500);
    fs.copySync(androidSplashCacheFolder, androidSplashFolder);
    // Log success
    log.success('Created Android splash screens.');
    // Open AndroidStudio
    if (config.android.openAndroidStudioAfterBuild) run.silent('npx cap open android');
  } catch (e) {
    log.error('Failed to create Android icons and splash screens.');
  }
};
createIconsAndSplashScreensAndOpenAndroidStudio();
