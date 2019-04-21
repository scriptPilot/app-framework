const { resolve } = require('path');
const jsonFix = require('json-schema-fix');
const { pathExistsSync, readJsonSync, writeJsonSync } = require('fs-extra');

const schemaFile = resolve(__dirname, '../configSchema.json');
const configFile = resolve(__dirname, '../../app/config.json');

const schema = readJsonSync(schemaFile);
const config = pathExistsSync(configFile) ? readJsonSync(configFile) : {};

const fixedConfig = jsonFix.fix(schema, config);

if (JSON.stringify(fixedConfig) !== JSON.stringify(config)) {
  writeJsonSync(configFile, fixedConfig, { spaces: 2 });
}

console.log('Fixed config file.');
