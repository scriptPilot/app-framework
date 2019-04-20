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

// Define manifest
const manifest = {
  name: config.meta.name,
  short_name: config.meta.shortName,
  description: config.meta.description,
  display: 'standalone',
  background_color: config.android.backgroundColor,
  theme_color: config.android.themeColor,
  icons: [
    {
      src: './icons/icon-192px.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: './icons/icon-512px.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
  scope: '/',
  start_url: '.',
  related_applications: [
    {
      platform: 'play',
      id: config.android.relatedPlayStoreApplicationID,
    },
  ],
  prefer_related_applications: true,
};

// Update manifest file
try {
  fs.outputJsonSync(path.cache('manifest.webmanifest'), manifest);
  log.success('Updated manifest.webmanifest file.');
} catch (e) {
  log.error('Failed to update manifest.webmanifest file.');
}
