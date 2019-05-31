#!/usr/bin/env node

const program = require('commander');
const buildDev = require('./scripts/buildDev');
const buildDevElectron = require('./scripts/buildDevElectron');

program
  .command('dev [target]')
  .action((target) => {
    if (target === 'electron') buildDevElectron();
    else buildDev();
  });

program.parse(process.argv);
