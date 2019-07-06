/* Purpose: Create/update/fix app config file according schema */

// Import modules
const fs = require('fs-extra');
const json = require('json-schema-fix');
const log = require('../helpers/log');
const path = require('../helpers/path');

// Cancel if app folder not exists
if (!fs.pathExistsSync(path.app())) process.exit(0);

// Load schema
const schemaFile = path.templates('app-config-schema.json');
let schema = null;
try {
  schema = fs.readJsonSync(schemaFile);
  log.info('Loaded app config schema.');
} catch (e) {
  log.error('Failed to load app config schema.');
}

// Load app configuration
const configFile = path.app('config.json');
let config = null;
try {
  config = fs.readJsonSync(configFile);
} catch (e) {
  config = {};
}

// Do fix
const fixedConfig = json.fix(schema, config);

// Update config file
if (JSON.stringify(fixedConfig) !== JSON.stringify(config)) {
  try {
    fs.outputJsonSync(configFile, fixedConfig, { spaces: 2 });
    log.success('Fixed app configuration file.');
  } catch (e) {
    log.error('Failed to fix app configuration file.');
  }
} else {
  log.info('Validated app configuration file.');
}
