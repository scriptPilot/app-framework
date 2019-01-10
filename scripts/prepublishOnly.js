// Import modules
const fs = require('fs-extra');
const { execSync } = require('child_process');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Cancel if no App Framework development mode
if (!fs.pathExistsSync(path.project('.enableDevelopmentMode'))) process.exit(0);

// Run tests
if (run.script('test').code !== 0) process.exit(1);

// Check if Git folder is clean (no changed but not committed files)
const gitStatus = run.silent('git status --porcelain');
if (gitStatus.stdout !== '') {
  log.error('Please clean up your Git folder first and commit all changes.');
}

// Bump version
execSync('npx bump --prompt --commit --all --lock', { stdio: 'inherit' });

// Check changelog update
const checkChangelog = () => {
  try {
    const { version } = fs.readJsonSync(path.framework('package.json'));
    const changelogFile = path.framework('CHANGELOG.md');
    const changelogFileContent = fs.readFileSync(changelogFile, { encoding: 'utf-8' });
    const searchRegExp = new RegExp(`\\n### App Framework v${version}`, 'g');
    const searchRes = changelogFileContent.match(searchRegExp);
    if (searchRes === null) {
      log.warning(`
        No changelog entry found for version ${version}.
        Please correct the CHANGELOG.md file and press any key.
      `);
      process.stdin.once('data', () => {
        checkChangelog();
      });
    } else if (searchRes.length === 1) {
      log.success(`Changelog entry found for version ${version}.`);
      process.exit(0);
    } else {
      log.warning(`
        ${searchRes.length} changelog entries found for version ${version}.
        Please correct the CHANGELOG.md file and press any key.
      `);
      process.stdin.once('data', () => {
        checkChangelog();
      });
    }
  } catch (e) {
    log.error('Failed to check the changelog.');
  }
};
checkChangelog();

// NO MORE CODE IN THIS FILE AFTER checkChangelog() (will be called immediately)
