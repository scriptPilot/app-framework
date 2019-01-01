#!/usr/bin/env node

const program = require('commander');
const run = require('../scripts/helper/run');

program
  .parse(process.argv);

run.script('dev');
