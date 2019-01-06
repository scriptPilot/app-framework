#!/usr/bin/env node

const program = require('commander');
const { execSync } = require('child_process');
const path = require('../scripts/helper/path');

program
  .option('--ftp', 'deploy PWA to FTP server')
  .option('--firebase', 'deploy PWA to Firebase Hosting')
  .parse(process.argv);

if (program.ftp) execSync('node ./deploy-ftp.js', { cwd: path.scripts(), stdio: 'inherit' });
if (program.firebase) execSync('node ./deploy-firebase.js', { cwd: path.scripts(), stdio: 'inherit' });
