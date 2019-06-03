// Import modules
const clc = require('cli-color');
const path = require('path');

// Determine debug mode
let debugMode;
try {
  const packageConfig = fs.readJsonSync(path.resolve(process.cwd(), 'package.json'))
  debugMode = packageConfig.debugMode === true
} catch (e) {
  debugMode = false;
}

// Export logger functions
module.exports = {
  debug(msg) {
    if (debugMode) {
      if (typeof msg === 'object' && msg !== null) {
        process.stdout.write(clc.bold.cyan('[DEBUG]'));
        console.dir(msg);
      } else {
        process.stdout.write(clc.bold.cyan('[DEBUG]'), clc.bold(msg));
      }
    }
  },
  info(msg) {
    process.stdout.write(clc.bold.blue('   [INFO]'), clc.bold(msg));
  },
  success(msg) {
    process.stdout.write(clc.bold.green('[SUCCESS]'), clc.bold(msg));
  },
  warning(msg) {
    process.stdout.write(clc.bold.yellow('[WARNING]'), clc.bold(msg));
  },
  error(msg) {
    process.stdout.write(clc.bold.red('  [ERROR]'), clc.bold(msg));
    process.exit(1);
  },
  reset() {
    process.stdout.write(clc.reset);
  },
};
