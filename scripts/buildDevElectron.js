const { spawn, execSync } = require('child_process');
const { copySync } = require('fs-extra');
const { resolve } = require('path');

const indexFile = resolve(process.cwd(), 'app/index.html');
const cacheFolder = resolve(__dirname, '../cache/parcel');
const buildFolder = resolve(__dirname, '../cache/dev');
const templateFile = resolve(__dirname, '../templates/electron.js');

process.stdout.write('Starting development build process ...\n');
const build = spawn('npx', ['parcel', indexFile, '--cache-dir', cacheFolder, '--out-dir', buildFolder], { stdout: 'pipe' });
build.stdout.on('data', (data) => {
  process.stdout.write(data.toString());
  if (data.toString().includes('Built')) {
    process.stdout.write('Updating Electron ...\n');
    execSync('npm update electron --save', { stdio: 'inherit' });
    copySync(templateFile, resolve(process.cwd(), 'app/electron.js'), { overwrite: false });
    process.stdout.write('Starting Electron ...\n');
    execSync('npx electron app/electron.js', { stdio: 'inherit' });
  }
});
