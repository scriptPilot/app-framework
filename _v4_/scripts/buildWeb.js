const { exec } = require('shelljs');
const { emptyDirSync } = require('fs-extra');

console.log('Starting production build ...');
emptyDirSync('build/web');
exec('npx parcel build cache/index.html --cache-dir cache/parcel --out-dir build/web --public-url . --no-source-maps');

console.log('Build web files.');
