const path = require('path');
const fs = require('fs-extra');

const isInstalled = fs.pathExistsSync(path.resolve(__dirname, '../../../../package.json'));

path.framework = (...nav) => path.resolve(__dirname, '../../', ...nav);
path.scripts = (...nav) => path.resolve(__dirname, '../', ...nav);
path.cache = (...nav) => path.resolve(__dirname, '../../.cache', ...nav);
path.project = (...nav) => path.resolve(__dirname, isInstalled ? '../../../../' : '../../', ...nav);
path.app = (...nav) => path.resolve(__dirname, isInstalled ? '../../../../app' : '../../app', ...nav);

module.exports = path;
