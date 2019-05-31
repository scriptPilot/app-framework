const { spawn } = require('child_process');
const { resolve } = require('path');
const { removeSync } = require('fs-extra');

module.exports = () => {

  const reportFile = 'eslint.log';

  const folders = process.cwd() === resolve(__dirname, '../')
    ? ['scripts', 'templates', 'cli.js']
    : ['app'];

  console.log('Fixing code ...');
  const lint = spawn('npx', ['eslint', '--ext', '.js,.vue', '--fix', '--quiet', '--output-file', reportFile, ...folders]);
  lint.on('close', (code) => {
    if (code === 0) {
      removeSync(reportFile);
      console.log('Fixed code.');
    } else {
      console.log('Some errors must be fixed manually.');
      console.log(`Please open the "${reportFile}" file for details.`);
      process.exit(0);
    }
  });


}
