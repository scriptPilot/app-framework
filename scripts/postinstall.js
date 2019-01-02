const run = require('./helper/run');
const log = require('./helper/logger');

const scripts = [
  'update-gitignore-config',
  'update-eslint-config',
  'update-package-config',
  'update-jest-config',
  'update-license-date',
  'create-app-folder',
];

const runNextScript = () => {
  if (scripts.length > 0) {
    run.script(scripts.shift(), (error) => {
      if (!error) runNextScript();
      else log.error('Failed to complete postinstall routine.');
    });
  } else {
    log.success('Completed postinstall routine.');
  }
};

runNextScript();
