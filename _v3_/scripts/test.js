const fs = require('fs-extra');
const run = require('./helper/run');
const log = require('./helper/logger');
const path = require('./helper/path');

if (run.script('fix-app-config').code !== 0) process.exit(1);

const config = fs.readJsonSync(path.app('config.json'));

if (config.eslint.runOnTestCommand) {
  if (run.script('test-eslint').code !== 0) process.exit(1);
}

if (config.jest.runOnTestCommand) {
  if (run.script('test-jest').code !== 0) process.exit(1);
}

log.success('Passed all tests.');
