const { spawn } = require('child_process');
const { resolve } = require('path');
const { removeSync } = require('fs-extra');

const reportFile = 'eslint.log';

console.log('Fixing code ...');
const lint = spawn('npx', ['eslint', '--ext', '.js,.vue', '--fix', '--quiet', '--output-file', reportFile, 'app', 'framework'], { cwd: resolve(__dirname, '../../') });
lint.on('close', (code) => {
  if (code === 0) {
    removeSync(reportFile);
    console.log('Fixed code.');
  } else {
    console.log('Failed to fix code.');
    console.log(`Please open the "${reportFile}" file for details.`);
    process.exit(1);
  }
});
