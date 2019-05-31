#!/usr/bin/env node

// Import modules
const program = require('commander');
const { resolve } = require('path');
const { spawn } = require('child_process');

// Function to run script and exit CLI if script ends with error
function runScript(scriptName) {
  const scriptPath = resolve(__dirname, 'scripts', scriptName);
  const run = spawn('node', [scriptPath], { stdio: ['inherit', 'inherit', 'ignore'] });
  run.on('close', (code) => {
    if (code !== 0) {
      process.stderr.write(`Failed to run script "${scriptName}".\n`);
      process.exit(1);
    }
  });
}

// Define CLI program
program
  .action((...args) => {
    if (args[0] === 'fix') {
      runScript('fixCode');
    } else if (args[0] === 'dev') {
      runScript('buildDev');
    } else {
      runScript('createNewProject');
    }
  });

program
  .parse(process.argv);
