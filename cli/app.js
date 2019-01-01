#!/usr/bin/env node

const program = require('commander');
const { version } = require('../package.json')

program
  .version(version, '-v --version')
  .command('dev', 'start development server')
  .command('build', 'build application')
  .parse(process.argv);
