const { spawn } = require('child_process');
const { exec } = require('shelljs');

console.log('Starting development build ...');
const lint = spawn('npx', ['parcel', 'cache/index.html', '--cache-dir', 'cache/parcel', '--out-dir', 'cache/dev']);
lint.stdout.on('data', (data) => {
  if (data.toString().includes('Built')) {
    console.log('Opening Electron app ...');
    exec('npx electron framework/electron.js');
  }
});
