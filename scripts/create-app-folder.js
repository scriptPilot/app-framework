const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const json = require('./helper/json')

const sourceFolder = path.templates('app');
const destFolder = path.app();

if (path.project() === path.framework()) {
  log.info('Skipped the app folder creation.');
} else if (fs.pathExistsSync(destFolder)) {
  log.info('Found app folder.');
} else {
  // Copy files
  fs.copySync(sourceFolder, destFolder);
  // Reset app config file from schema with default values
  const schema = fs.readJsonSync(path.templates('app-config-schema.json'))
  const config = json.create(schema)
  fs.outputJsonSync(path.app('config.json'), config, { spaces: 2 })
  // Log success
  log.success('Created app folder.');
}
