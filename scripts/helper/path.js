const path = require('path');
const fs = require('fs-extra');

const isInstalled = fs.pathExistsSync(path.resolve(__dirname, '../../../../package.json'));

// Framework related shortcuts
path.framework = (...nav) => path.resolve(__dirname, '../../', ...nav);
path.templates = (...nav) => path.resolve(__dirname, '../../templates', ...nav);
path.scripts = (...nav) => path.resolve(__dirname, '../', ...nav);
path.cache = (...nav) => path.resolve(__dirname, '../../.cache', ...nav);

// Project related shortcuts
path.project = (...nav) => path.resolve(__dirname, isInstalled ? '../../../../' : '../../', ...nav);
path.app = (...nav) => path.resolve(__dirname, isInstalled ? '../../../../app' : '../../templates/app', ...nav);
path.build = (...nav) => path.resolve(__dirname, isInstalled ? '../../../../build' : '../../build', ...nav);

module.exports = path;
