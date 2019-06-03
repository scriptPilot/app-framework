// Import modules
const { resolve } = require('path');
const { exec } = require('child_process');
const { removeSync } = require('fs-extra');

// Define log file name
const logFile = 'ESLint.log';

// Define relevant folders
const folders = process.cwd() === resolve(__dirname, '../') ? ['scripts', 'templates', 'cli.js'] : ['app'];

// Run ESLint
process.stdout.write('Starting code fix ...\n');
exec(`npx eslint ${folders.join(' ')} --fix --ext .js,.vue --quiet --output-file ${logFile}`, (error) => {
  if (error) {
    process.stdout.write(`Some findings must be fixed manually.\nPlease check the "${logFile}" file.\n`);
    process.exit(1);
  } else {
    removeSync(logFile);
    process.stdout.write('Completed code fix.\n');
  }
});
