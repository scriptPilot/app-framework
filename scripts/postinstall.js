const run = require('./helper/run');
const log = require('./helper/logger');

const scripts = [
  'update-editor-config',
  'update-gitignore-config',
  'update-eslint-config',
  'update-package-config',
  'update-jest-config',
  'update-license-date',
  'create-app-folder',
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
