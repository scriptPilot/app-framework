const { resolve } = require('path');
const { execSync } = require('child_process');

const indexFile = resolve(process.cwd(), 'app/index.html');
const cacheFolder = resolve(__dirname, '../cache/parcel');
const buildFolder = resolve(__dirname, '../cache/dev');

process.stdout.write('Starting development build process ...\n');
execSync(`npx parcel "${indexFile}" --cache-dir "${cacheFolder}" --out-dir "${buildFolder}"`, { stdio: 'inherit' });
