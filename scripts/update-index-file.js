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

// Create index.html file content
const indexFileContent = `
<!DOCTYPE html>
<html lang="${config.meta.language}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="theme-color" content="${config.android.themeColor}" />
  <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap:" />
  <meta name="description" content="${config.meta.description}" />
  <meta name="apple-itunes-app" content="app-id=${config.ios.relatedITunesApplicationID}" />
  <title>${config.meta.name}</title>
</head>
<body>
  <div id="app"></div>
  <script src="./main.js"></script>
  <noscript>This application needs enabled JavaScript.</noscript>
</body>
`;

// Update index.html file
try {
  fs.outputFileSync(path.cache('index.html'), indexFileContent.trim());
  log.success('Created index.html file.');
} catch (e) {
  log.error('Failed to create index.html file.');
}
