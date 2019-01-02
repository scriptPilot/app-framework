const fs = require('fs-extra');
const run = require('./helper/run');
const log = require('./helper/logger');
const path = require('./helper/path');

const config = fs.readJsonSync(path.app('config.json'));

const tests = [];
if (config.test.eslint.runOnTestCommand) tests.push(`node "${path.scripts('test-eslint.js')}"`);
if (config.test.jest.runOnTestCommand) tests.push(`node "${path.scripts('test-jest.js')}"`);

if (tests.length > 0) {
  run.loud(tests.join(' && '), (err) => {
    if (err) log.error('Failed one or more tests.');
    else log.success('Passed all tests.');
  });
} else {
  log.info('No tests configured.');
}
