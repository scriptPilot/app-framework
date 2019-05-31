const { resolve } = require('path');
const { spawn } = require('child_process');
const { removeSync } = require('fs-extra');

const reportFile = 'eslint.log';

const folders = process.cwd() === resolve(__dirname, '../')
  ? ['scripts', 'templates', 'cli.js']
  : ['app'];

process.stdout.write('Starting code fix ...\n');
const lint = spawn('npx', ['eslint', '--ext', '.js,.vue', '--fix', '--quiet', '--output-file', reportFile, ...folders]);
lint.on('close', (code) => {
  if (code === 0) {
    removeSync(reportFile);
    process.stdout.write('Completed code fix.\n');
  } else {
    process.stdout.write('Some errors must be fixed manually.\n');
    process.stdout.write(`Please open the "${reportFile}" file for details.\n`);
    process.exit(1);
  }
});
