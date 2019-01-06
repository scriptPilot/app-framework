#!/usr/bin/env node

const program = require('commander');
const { execSync } = require('child_process');
const path = require('../scripts/helper/path');

program
  .option('--ftp', 'deploy PWA to FTP server')
  .parse(process.argv);

if (program.ftp) execSync('node ./deploy-ftp.js', { cwd: path.scripts(), stdio: 'inherit' });
