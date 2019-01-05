// Import modules
const { exec } = require('shelljs');
const fs = require('fs-extra');
const log = require('./logger');
const path = require('./path');

// Define debug mode
let debugMode;
try {
  ({ debugMode } = fs.readJsonSync(path.app('config.json')));
} catch (e) {
  debugMode = false;
}

// Export functions
module.exports = {
  silent(command, callback) {
    if (typeof callback === 'function') {
      exec(command, { cwd: path.project(), silent: true }, callback);
      return undefined;
    }
    const res = exec(command, { cwd: path.project(), silent: true });
    if (debugMode) {
      log.debug(`Command: ${command}`);
      log.debug(res.stdout);
    }
    return res;
  },
  loud(command, callback) {
    if (typeof callback === 'function') {
      exec(command, { cwd: path.project(), silent: false }, callback);
      return undefined;
    }
    const res = exec(command, { cwd: path.project(), silent: false });
    if (debugMode) {
      log.debug(`Command: ${command}`);
      log.debug(res.stdout);
    }
    return res;
  },
  script(scriptName) {
    return exec(`node ./scripts/${scriptName}.js`, { cwd: path.framework(), silent: false });
  },
};
