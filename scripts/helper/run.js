const { exec } = require('shelljs');
const path = require('./path');

module.exports = {
  silent(command, callback) {
    exec(command, { cwd: path.project(), silent: true }, callback);
  },
  loud(command, callback) {
    exec(command, { cwd: path.project(), silent: false }, callback);
  },
  script(scriptName, callback) {
    exec(`node scripts/${scriptName}.js`, { cwd: path.framework(), silent: false }, callback);
  },
};
