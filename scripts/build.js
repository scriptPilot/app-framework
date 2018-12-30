const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('./helper/path');

// Run tests
shell.exec('node test-eslint', { cwd: path.scripts() });

// Empty build folder
fs.emptyDirSync(path.build());

// Build PWA
shell.exec('node build-pwa', { cwd: path.scripts() });
