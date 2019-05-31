const clc = require('cli-color');

const debugMode = false;

module.exports = {
  debug(msg) {
    if (debugMode) {
      if (typeof msg === 'object' && msg !== null) {
        console.log(clc.bold.cyan('[DEBUG]')); // eslint-disable-line no-console
        console.dir(msg); // eslint-disable-line no-console
      } else {
        console.log(clc.bold.cyan('[DEBUG]'), clc.bold(msg)); // eslint-disable-line no-console
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
  error(msg) {
    console.log(clc.bold.red('  [ERROR]'), clc.bold(msg)); // eslint-disable-line no-console
    process.exit(1);
  },
  reset() {
    process.stdout.write(clc.reset);
  },
};
