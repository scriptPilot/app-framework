const { resolve } = require('path');
const { execSync } = require('child_process');
const fs = require('fs-extra');

const indexFile = resolve(process.cwd(), 'app/index.html');
const cacheFolder = resolve(__dirname, '../cache/parcel');
const buildFolder = resolve(__dirname, '../cache/web');
const destFolder = resolve(process.cwd(), 'build/web');

fs.emptyDirSync(buildFolder);

process.stdout.write('Starting production web build process ...\n');
execSync(`npx parcel build "${indexFile}" --cache-dir "${cacheFolder}" --out-dir "${buildFolder}" --no-source-maps`, { stdio: 'inherit' }, (err) => {
  if (err) {
    process.stdout.write('Failed to build web files.\n');
    process.exit(1);
  } else {
    fs.emptyDirSync(destFolder);
    fs.copySync(buildFolder, destFolder);
    process.stdout.write('Completed web build.');
  }
});
