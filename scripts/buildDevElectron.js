const { spawn, execSync } = require('child_process');
const { copySync } = require('fs-extra');
const { resolve } = require('path');
const logger = require('../helper/logger');

const indexFile = resolve(process.cwd(), 'app/index.html');
const cacheFolder = resolve(__dirname, '../../cache/parcel');
const buildFolder = resolve(__dirname, '../../cache/dev');
const templateFile = resolve(__dirname, '../../templates/electron.js');

module.exports = () => {
  const lint = spawn('npx', ['parcel', indexFile, '--cache-dir', cacheFolder, '--out-dir', buildFolder]);
  lint.stdout.on('data', (data) => {
    console.log(data.toString());
    if (data.toString().includes('Built')) {
      execSync('npm update electron --save', { stdio: 'inherit' });
      copySync(templateFile, resolve(process.cwd(), 'app/electron.js'), { overwrite: false });
      execSync('npx electron app/electron.js', { stdio: 'inherit' });
    }
  });
};
