const shell = require('shelljs');
const path = require('./helper/path');

shell.exec('node update-gitignore', { cwd: path.scripts() });
shell.exec('node update-eslint-config', { cwd: path.scripts() });
shell.exec('node update-package-config', { cwd: path.scripts() });
shell.exec('node update-jest-config', { cwd: path.scripts() });
shell.exec('node update-license-date', { cwd: path.scripts() });
shell.exec('node create-app-folder', { cwd: path.scripts() });
