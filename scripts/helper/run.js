
const { exec } = require('shelljs');
const path = require('./path');

module.exports = {
  silent(command, callback) {
    exec(command, { cwd: path.framework(), silent: true }, callback);
  },
  loud(command, callback) {
    exec(command, { cwd: path.framework() }, callback);
  },
  script(scriptName, callback) {
    exec(`node scripts/${scriptName}.js`, { cwd: path.framework() }, callback);
  },
};
