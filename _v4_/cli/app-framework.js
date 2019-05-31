#!/usr/bin/env node

const program = require('commander');
const startNewProject = require('./scripts/startNewProject');
const buildDev = require('./scripts/buildDev');
const buildDevElectron = require('./scripts/buildDevElectron');
const { exec } = require('shelljs');
const { resolve } = require('path');

function runScript(scriptName) {
  const scriptPath = resolve(__dirname, '../scripts/', scriptName);
  exec(`node ${scriptPath}`);
}

program
  .command('fix')
  .action(() => {
    runScript('fixCode');
  });

program
  .action(startNewProject);

program
  .command('dev [target]')
  .action((target) => {
    if (target === 'electron') buildDevElectron();
    else buildDev();
  });

program
  .parse(process.argv);
