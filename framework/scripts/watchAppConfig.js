const { watchFile } = require('fs-extra');
const { exec } = require('shelljs');

console.log('Watching app config file ...');
watchFile('app/config.json', () => {
  exec('node framework/scripts/fixConfig');
  exec('node framework/scripts/buildAppScript');
  exec('node framework/scripts/buildIndexFile');
});
