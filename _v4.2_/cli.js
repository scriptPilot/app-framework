#!/usr/bin/env node

// Import modules
const { resolve } = require('path');
const { execSync } = require('child_process');

// Create shortcut function to run scripts and exit script on error
function runScript(scriptName) {
  const scriptFile = resolve(__dirname, 'scripts', scriptName);
  try {
    execSync(`node ${scriptFile}`, { stdio: 'inherit' });
  } catch (e) {
    process.exit(0);
  }
}

// Get CLI arguments
const args = process.argv.slice(2);

// Run scripts
if (args[0] === 'fix') {
  runScript('fixCode');
} else if (args[0] === 'dev' && args[1] === 'electron') {
  runScript('buildDevElectron');
} else if (args[0] === 'dev') {
  runScript('buildDev');
} else if (args[0] === 'build') {
  runScript('buildWeb');
  runScript('buildPWA');
} else {
  runScript('createNewProject');
}
