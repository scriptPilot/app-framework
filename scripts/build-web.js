// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Define cache folder
const cacheFolder = path.cache('web');

// Empty cache folder
try {
  fs.emptyDirSync(cacheFolder);
  log.success('Emptied web build cache folder.');
} catch (e) {
  log.error('Failed to empty web build cache folder.');
}

// Update index.html file
if (run.script('update-index-file').code !== 0) process.exit(1);

// Update main.js file
if (run.script('update-main-file').code !== 0) process.exit(1);

// Build files
const parcelCacheFolder = path.cache('parcel');
log.warning('Building web files - this may take a while ...');
const webFilesBuild = run.silent(`
    npx parcel build "${path.cache('index.html')}"
    --public-url .
    --cache-dir "${parcelCacheFolder}"
    --out-dir "${cacheFolder}"
    --no-source-maps
`.replace(/\n/g, ' '));
if (webFilesBuild.code === 0) log.success('Built www files.');
else log.error('Failed to build www files.');

// Move service worker file in main cache folder
try {
  fs.moveSync(path.cache('web/sw.js'), path.cache('sw.js'), { overwrite: true });
  log.success('Moved service worker to cache folder.');
} catch (e) {
  log.error('Failed to move service worker to cache folder.');
}
