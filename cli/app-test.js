#!/usr/bin/env node

const program = require('commander');
const run = require('../scripts/helper/run');

program
  .option('--eslint', 'run ESLint test only')
  .option('--jest', 'run Jest tests only')
  .parse(process.argv);

if (program.eslint) run.script('test-eslint');
else if (program.jest) run.script('test-jest');
else run.script('test');
