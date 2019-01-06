// Import modules
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('./helper/path');
const log = require('./helper/logger');

// Check if PWA was build before
const pwaFolder = path.project('pwa');
if (!fs.pathExistsSync(pwaFolder)) {
  log.error('Folder /pwa not found. Please run build process before.');
  process.exit(0);
}

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// Check if Firebase project ID is set
if (config.firebase.projectID === '') log.error('Please add the firebase project ID in the app configuration file.');


// Update .firebaserc file
const firebasercFile = path.project('.firebaserc');
const firebasercConfig = {
  projects: {
    default: config.firebase.projectID,
  },
};
try {
  fs.outputJsonSync(firebasercFile, firebasercConfig, { spaces: 2 });
  log.success('Updated the .firebaserc file.');
} catch (e) {
  log.error('Failed to update the .firebaserc file.');
}

// Update firebase.json file
const firebaseJsonFile = path.project('firebase.json');
const firebaseJsonConfig = {
  hosting: {
    public: './pwa',
    ignore: ['.htaccess'],
    rewrites: [
      {
        source: '**',
        destination: '/index.html',
      },
    ],
  },
};
try {
  fs.outputJsonSync(firebaseJsonFile, firebaseJsonConfig, { spaces: 2 });
  log.success('Updated the firebase.json file.');
} catch (e) {
  log.error('Failed to update the firebase.json file.');
}

// Login to Firebase
execSync('npx firebase login', { cwd: path.project(), stdio: 'inherit' });

// Use configured project (value in .firebaserc.json not considered properly)
execSync(`npx firebase use "${config.firebase.projectID}"`, { cwd: path.project(), stdio: 'inherit' });

// Do deployment
execSync('npx firebase deploy --only hosting', { cwd: path.project(), stdio: 'inherit' });
