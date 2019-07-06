/* Purpose: Provide logger functionality */

// Import modules
const fs = require('fs-extra');
const clc = require('cli-color');
const path = require('./path');

// Define debug mode
let debugMode;
try {
  ({ debugMode } = fs.readJsonSync(path.app('config.json')));
} catch (e) {
  debugMode = false;
}

// Define logger functions
const logger = {
  debug(msg, force = false) {
    if (debugMode || force) {
      if (typeof msg === 'object' && msg !== null) {
        console.log(clc.bold.cyan('  [DEBUG]')); // eslint-disable-line no-console
        console.dir(msg); // eslint-disable-line no-console
      } else {
        console.log(clc.bold.cyan('  [DEBUG]'), clc.bold(msg)); // eslint-disable-line no-console
      }
    }
  },
  info(msg) {
    console.log(clc.bold.blue('   [INFO]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  success(msg) {
    console.log(clc.bold.green('[SUCCESS]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  warning(msg) {
    console.log(clc.bold.yellow('[WARNING]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  error(msg, err = null) {
    console.log(clc.bold.red('  [ERROR]'), clc.bold(msg)); // eslint-disable-line no-console
    if (err) this.debug(err, true);
    process.exit(1);
  },
  reset() {
    process.stdout.write(clc.reset);
  },
};

// Handle all unhandled exceptions
process.on('uncaughtException', (err) => {
  logger.error('Unexpected Error', err);
});

// Export logger functions
module.exports = logger;
