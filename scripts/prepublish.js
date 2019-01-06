// Import modules
const fs = require('fs-extra');
const json = require('json-schema-fix');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Cancel if no App Framework development mode
if (!fs.pathExistsSync(path.project('.enableDevelopmentMode'))) process.exit(0);

// Reset templates/app/config.json to default values according schema
try {
  const schemaFile = path.templates('app-config-schema.json');
  const templateConfigFile = path.templates('app/config.json');
  const schema = fs.readJsonSync(schemaFile);
  fs.outputJsonSync(templateConfigFile, json.create(schema), { spaces: 2 });
  log.success('Reset templates/app/config.json file.');
} catch (e) {
  log.error('Failed to reset the templates/app/config.json file.');
}

// Run tests
if (run.script('test').code !== 0) process.exit(1);
