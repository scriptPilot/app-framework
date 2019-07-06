/* Purpose: Run CLI commands silent or loud, with shortcut to run scripts */

// Import modules
const { exec } = require('shelljs');
const fs = require('fs-extra');
const log = require('./log');
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
      log.debug(`Command "${command}" exit with code ${res.code}`);
      if (res.stderr.length > 0) log.debug(`StdErr: ${res.stderr}`);
      if (res.stdout.length > 0) log.debug(`StdOut: ${res.stdout}`);
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
      log.debug(`Command "${command}" exit with code ${res.code}`);
      if (res.stderr.length > 0) log.debug(`StdErr: ${res.stderr}`);
      if (res.stdout.length > 0) log.debug(`StdOut: ${res.stdout}`);
    }
    return res;
  },
  script(scriptName) {
    const scriptFile = path.scripts(`${scriptName}.js`);
    // Changing the cwd will result in error on app path detection
    const res = exec(`node ${scriptFile}`, { silent: false });
    if (res.code !== 0) process.exit();
    return res;
  },
};
