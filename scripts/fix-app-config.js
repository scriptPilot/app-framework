// Import modules
const fs = require('fs-extra');
const json = require('json-schema-fix');
const log = require('./helper/logger');
const path = require('./helper/path');

// Load schema
const schemaFile = path.templates('app-config-schema.json');
let schema = null;
try {
  schema = fs.readJsonSync(schemaFile);
  log.success('Loaded app config schema.');
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
