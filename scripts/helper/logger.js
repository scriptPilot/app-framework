const clc = require('cli-color');
const fs = require('fs-extra');
const path = require('./path');

const configFile = path.app('config.json');
const level = fs.pathExistsSync(configFile) ? fs.readJsonSync(configFile).development.logLevel : 'debug';

module.exports = {
  debug(msg) {
    if (level === 'debug') {
      console.log(clc.bold.cyan('[DEBUG]'), clc.bold(msg)); // eslint-disable-line no-console
    }
  },
  info(msg) {
    if (level === 'debug' || level === 'info') {
      console.log(clc.bold.blue('[INFO]'), clc.bold(msg)); // eslint-disable-line no-console
    }
  },
  success(msg) {
    console.log(clc.bold.green('[SUCCESS]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  warning(msg) {
    console.log(clc.bold.yellow('[WARNING]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  error(msg) {
    console.log(clc.bold.red('[ERROR]'), clc.bold(msg)); // eslint-disable-line no-console
    process.exit(1);
  },
  reset() {
    process.stdout.write(clc.reset);
  },
};
