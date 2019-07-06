#!/usr/bin/env node

/*
  Purpose: This CLI script manages console commands by the end user
  and calls one or more script files per command.
*/

// Import modules
const run = require('./helpers/run');

// Get CLI arguments
const args = process.argv.slice(2);

// Handle CLI commands and call scripts
if (args[0] === 'create') {
  run.script('create');
}
