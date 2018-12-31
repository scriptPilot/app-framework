const shell = require('shelljs');
const path = require('./helper/path');

console.log(path.framework(), path.scripts(), path.cache(), path.project(), path.app())

shell.exec('node update-gitignore', { cwd: path.scripts() });
shell.exec('node update-eslintrc', { cwd: path.scripts() });
shell.exec('node create-app-folder', { cwd: path.scripts() });
