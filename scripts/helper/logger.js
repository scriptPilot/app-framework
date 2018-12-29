const clc = require('cli-color');

module.exports = {
  info(msg) {
    console.log(clc.bold.blue('[INFO]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  success(msg) {
    console.log(clc.bold.green('[SUCCESS]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  warning(msg) {
    console.log(clc.bold.yellow('[WARNING]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  error(msg) {
    console.log(clc.bold.red('[ERROR]'), clc.bold(msg)); // eslint-disable-line no-console
  },
  reset() {
    process.stdout.write(clc.reset);
  },
};
