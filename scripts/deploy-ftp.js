// Load modules
const fs = require('fs-extra');
const prompt = require('prompt');
const FTP = require('ftp-deploy');
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

// Ask for FTP credentials
log.warning('Please enter your FTP credentials for the deployment.');
log.warning('If default values are shown, you can press enter to confirm.');
const schema = {
  properties: {
    host: {
      description: 'FTP Host',
      default: config.ftp.defaultHost,
      required: true,
    },
    port: {
      description: 'FTP Port',
      default: config.ftp.defaultPort !== '' ? config.ftp.defaultPort : 21,
    },
    remoteRoot: {
      description: 'FTP Upload Path',
      default: config.ftp.defaultPathOnServer !== '' ? config.ftp.defaultPathOnServer : '/',
    },
    user: {
      description: 'FTP User Name',
      default: config.ftp.defaultUserName,
      required: true,
    },
    password: {
      description: 'FTP Password',
      default: config.ftp.defaultPassword,
      hidden: true,
      replace: '*',
      required: true,
    },
  },
};
prompt.start();
prompt.get(schema, (error, promptedValues) => {
  // Copy and adjust configuration
  const ftpConfig = JSON.parse(JSON.stringify(promptedValues));
  ftpConfig.localRoot = pwaFolder;
  ftpConfig.include = ['**/*', '*', '.*'];
  ftpConfig.exclude = [];
  ftpConfig.deleteRemote = false;
  ftpConfig.forcePasv = true;

  // Connect to FTP server
  log.warning('Deploying PWA to the FTP server - this may take a while ...');
  const ftp = new FTP();
  ftp.deploy(ftpConfig, (err) => {
    if (err) log.error('FTP deployment failed.');
    log.success('Completed FTP deployment.');
  });
});
