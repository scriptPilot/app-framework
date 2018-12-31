const path = require('path');
const fs = require('fs-extra');

const isInstalled = fs.pathExistsSync(path.resolve(__dirname, '../../../../package.json'));

module.exports = {
  framework(...nav) {
    return path.resolve(__dirname, '../../', ...nav);
  },
  scripts(...nav) {
    return path.resolve(__dirname, '../', ...nav);
  },
  cache(...nav) {
    return path.resolve(__dirname, '../../.cache', ...nav);
  },
  project(...nav) {
    return path.resolve(__dirname, isInstalled ? '../../../../' : '../../', ...nav);
  },
  app(...nav) {
    return path.resolve(__dirname, isInstalled ? '../../../../app' : '../../app', ...nav);
  },
};
