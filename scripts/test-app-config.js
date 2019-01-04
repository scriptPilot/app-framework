// Import modules
const Ajv = require('ajv');
const fs = require('fs-extra');
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
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// Do validation
const validate = (new Ajv({ format: 'full' })).compile(schema);
const valid = validate(config);
if (valid) {
  log.success('Passed app/config.json file validation.');
} else {
  const errorReport = [];
  validate.errors.forEach((error) => {
    errorReport.push(`
      Message: ${error.message}
      Data Path: root${error.dataPath}
      Parameters: ${JSON.stringify(error.params)}
    `);
  });
  log.error(`Failed app/config.json file validation.\n${errorReport.join('')}`);
}
