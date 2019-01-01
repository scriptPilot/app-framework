const fs = require('fs-extra');
const run = require('./helper/run');
const log = require('./helper/logger');
const path = require('./helper/path');

const config = fs.readJsonSync(path.app('config.json'));

const tests = [];
if (config.test.eslint.runTest) tests.push('node scripts/test-eslint.js');
if (config.test.jest.runTest) tests.push('node scripts/test-jest.js');

run.loud(tests.join(' && '), (err) => {
  if (!err) {
    log.success('Passed all tests.');
  }
});
