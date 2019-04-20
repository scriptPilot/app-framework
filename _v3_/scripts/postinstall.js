const run = require('./helper/run');
const log = require('./helper/logger');

const scripts = [
  'fix-app-config',
  'create-app-folder',
  'update-editor-config',
  'update-gitignore-config',
  'update-package-config',
  'update-jest-config',
  'update-license-date',
  'install-capacitor',
];

const runNextScript = () => {
  if (scripts.length > 0) {
    const scriptResult = run.script(scripts.shift());
    if (scriptResult.code === 0) runNextScript();
    else log.error('Failed to complete postinstall routine.');
  } else {
    log.success('Completed postinstall routine.');
  }
};

runNextScript();
