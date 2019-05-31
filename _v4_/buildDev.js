const { exec } = require('shelljs');

console.log('Starting development build ...');
exec('npx parcel cache/index.html --cache-dir cache/parcel --out-dir cache/dev');
