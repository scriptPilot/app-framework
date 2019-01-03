const fs = require('fs-extra');
const run = require('./helper/run');
const log = require('./helper/logger');
const path = require('./helper/path');

const config = fs.readJsonSync(path.app('config.json'));

if (config.test.eslint.runOnTestCommand) {
  if (run.script('test-eslint').code !== 0) process.exit(1);
}

if (config.test.jest.runOnTestCommand) {
  if (run.script('test-jest').code !== 0) process.exit(1);
}

log.success('Passed all tests.');
