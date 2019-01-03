const { exec } = require('shelljs');
const path = require('./path');

module.exports = {
  silent(command, callback) {
    if (typeof callback === 'function') {
      exec(command, { cwd: path.project(), silent: true }, callback);
      return undefined;
    }
    return exec(command, { cwd: path.project(), silent: true });
  },
  loud(command, callback) {
    if (typeof callback === 'function') {
      exec(command, { cwd: path.project(), silent: false }, callback);
      return undefined;
    }
    return exec(command, { cwd: path.project(), silent: false });
  },
  script(scriptName) {
    return exec(`node ./scripts/${scriptName}.js`, { cwd: path.framework(), silent: false });
  },
};
