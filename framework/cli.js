#!/usr/bin/env node

const program = require('commander')
const { exec } = require('shelljs')

program
  .command('dev')
  .action(() => {
    exec('node framework/scripts/buildAppScript')
    exec('node framework/scripts/buildIndexFile')
    exec('npx concurrently --kill-others "node framework/scripts/watchAppConfig" "node framework/scripts/buildDev"')
  })

program
  .command('build')
  .action(() => {
    exec('node framework/scripts/buildAppScript')
    exec('node framework/scripts/buildIndexFile')
    exec('node framework/scripts/buildWeb')
  })

program.parse(process.argv);
