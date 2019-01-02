const fs = require('fs-extra');
const path = require('./helper/path');
const log = require('./helper/logger');
const run = require('./helper/run');

// Define cache folder for development build
const cacheFolder = path.cache('buid-dev');

// Empty cache folder
fs.emptyDirSync(cacheFolder);

// Read app config
const config = fs.readJsonSync(path.app('config.json'));

// Prepare index.html file
const cachedIndexFile = path.cache(cacheFolder, 'index.html');
let indexFileContent = fs.readFileSync(path.templates('index.html'), { encoding: 'utf8' });
indexFileContent = indexFileContent.replace(/\{name\}/g, config.meta.name);
indexFileContent = indexFileContent.replace(/\{description\}/g, config.meta.description);
indexFileContent = indexFileContent.replace(/\{language\}/g, config.meta.language);
indexFileContent = indexFileContent.replace(/\{androidThemeColor\}/g, config.frontend.android.themeColor);
indexFileContent = indexFileContent.replace(/\{relatedITunesApplicationID\}/g, config.frontend.ios.relatedITunesApplicationID);
indexFileContent = indexFileContent.replace(/<link rel="manifest" href="(.*)manifest.webmanifest" \/>/, '');
fs.writeFileSync(cachedIndexFile, indexFileContent);
log.success('Prepared index file.');

// Prepare main.js file
const cachedMainFile = path.cache(cacheFolder, 'main.js');
let mainFileContent = fs.readFileSync(path.templates('main.js'), { encoding: 'utf8' });
mainFileContent = mainFileContent.replace('./app/app.vue', path.relative(path.cache(cacheFolder), path.app('app.vue')));
fs.writeFileSync(cachedMainFile, mainFileContent);
log.success('Prepared main script file.');

// Build files
const parcelCacheFolder = path.cache('parcel');
log.warning('Building development files - this may take a while ...');
run.loud(`npx parcel "${cachedIndexFile}" --cache-dir "${parcelCacheFolder}" --out-dir "${cacheFolder}" --open`);
