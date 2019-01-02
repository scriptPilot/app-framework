const fs = require('fs-extra');
const path = require('./helper/path');
const run = require('./helper/run');
const log = require('./helper/logger');

// Empty cache folder
fs.emptyDirSync(path.cache('build-pwa'));

// Read app config
const config = fs.readJsonSync(path.app('config.json'));

// Prepare index.html file
const cachedIndexFile = path.cache('build-pwa/index.html');
let indexFileContent = fs.readFileSync(path.templates('index.html'), { encoding: 'utf8' });
indexFileContent = indexFileContent.replace(/\{name\}/g, config.meta.name);
indexFileContent = indexFileContent.replace(/\{description\}/g, config.meta.description);
indexFileContent = indexFileContent.replace(/\{language\}/g, config.meta.language);
indexFileContent = indexFileContent.replace(/\{androidThemeColor\}/g, config.frontend.android.themeColor);
indexFileContent = indexFileContent.replace(/\{relatedITunesApplicationID\}/g, config.frontend.ios.relatedITunesApplicationID);
fs.writeFileSync(cachedIndexFile, indexFileContent);
log.success('Prepared index file.');

// Prepare manifest file
const cachedManifestFile = path.cache('build-pwa/manifest.webmanifest');
const manifestFileContent = fs.readJsonSync(path.templates('manifest.webmanifest'));
manifestFileContent.name = config.meta.name;
manifestFileContent.short_name = config.meta.shortName;
manifestFileContent.description = config.meta.description;
manifestFileContent.background_color = config.frontend.android.backgroundColor;
manifestFileContent.theme_color = config.frontend.android.themeColor;
manifestFileContent.icons = [
  {
    src: '../icons/icon-192px.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: '../icons/icon-512px.png',
    sizes: '512x512',
    type: 'image/png',
  },
];
const playStoreId = config.frontend.android.relatedPlayStoreApplicationID;
manifestFileContent.related_applications[0].id = playStoreId;
fs.writeJsonSync(cachedManifestFile, manifestFileContent, { spaces: 2 });
log.success('Prepared manifest file.');

// Prepare main.js file
const cachedMainFile = path.cache('build-pwa/main.js');
let mainFileContent = fs.readFileSync(path.templates('main.js'), { encoding: 'utf8' });
mainFileContent = mainFileContent.replace('./app/app.vue', path.relative(path.cache('build-pwa'), path.app('app.vue')));
fs.writeFileSync(cachedMainFile, mainFileContent);
log.success('Prepared main script file.');

// Create robots.txt file
const robotsFile = path.build('pwa/robots.txt');
const robotsFileContent = 'User-Agent: *\nDisallow:';
fs.writeFileSync(robotsFile, robotsFileContent);
log.success('Created robots.txt file.');

// Create .htaccess file
const htaccessFile = path.build('pwa/.htaccess');
const htaccessFileContent = '<filesMatch "\\.(.+)\\.(.+)$">\n'
                          + 'Header set Cache-Control "max-age=31536000, public"\n'
                          + '</filesMatch>';
fs.writeFileSync(htaccessFile, htaccessFileContent);
log.success('Created .htaccess file.');

// Build files
const parcelCacheFolder = path.cache('parcel');
const buildFolder = path.build('pwa');
log.warning('Building PWA files - this may take a while ...');
run.loud(`npx parcel build "${cachedIndexFile}" --cache-dir "${parcelCacheFolder}" --out-dir "${buildFolder}" --no-source-maps`, (error) => {
  // Build ok
  if (!error) {
    log.success('Built PWA files.');

    // Update Capacitor configuration file
    const capConfig = {
      appId: config.meta.appID,
      appName: config.meta.name,
      bundledWebRuntime: false,
      webDir: '../../build/pwa',
    };
    fs.writeJsonSync(path.cache('capacitor/capacitor.config.json'), capConfig, { spaces: 2 });

    // Open PWA
    run.custom('npx cap serve', { cwd: path.cache('capacitor') });

    log.success('Completed PWA build.');

  // Build not ok
  } else {
    log.error('Failed to build PWA files.');
  }
});
