const { exec } = require('shelljs');
const path = require('./path');

module.exports = {
  silent(command) {
    return exec(command, { cwd: path.project(), silent: true });
  },
  loud(command) {
    return exec(command, { cwd: path.project(), silent: false });
  },
  script(scriptName) {
    return exec(`node ./scripts/${scriptName}.js`, { cwd: path.framework(), silent: false });
  },
};
