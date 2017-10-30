/* Purpose: Update .gitignore and .npmignore files */

'use strict'

const env = require('./env')
const alert = require('./alert')
const fs = require('fs-extra')
const abs = require('path').resolve

const gitIgnore = {
  'Allway Sync folder': '_SYNCAPP/',
  'Git folder': '.git/',
  'node modules (with cache)': 'node_modules/',
  'project snapshots': 'snapshots/',
  'macOS system files': '.DS_Store',
  'development mode enabling file': '.enable-dev-mode',
  'log files': '*.log*',
  'zip files (deprecated)': '*.zip',
  'database backups (deprecated)': 'database-backup.json',
  'FTP config file': 'ftp-config.json',
  'ESLint configuration file': '.eslintrc',
  'Editor configuration file': '.editorconfig'
}

const npmIgnore = JSON.parse(JSON.stringify(gitIgnore))
npmIgnore['Build folder'] = 'build/'
npmIgnore['Demo folder'] = 'demo/'
npmIgnore['Documentation folder'] = 'docs/'
npmIgnore['Documentation file'] = 'DOCUMENTATION.md'
npmIgnore['media folder'] = 'media/'

const introduction = '# This file is updated automatically - Please do not change!\n\n'

let gitFile = introduction
for (let item in gitIgnore) gitFile += `# Exclude ${item}\n${gitIgnore[item]}\n\n`

let npmFile = introduction
for (let item in npmIgnore) npmFile += `# Exclude ${item}\n${npmIgnore[item]}\n\n`

alert('.gitignore file update ongoing')
try {
  fs.writeFileSync(abs(env.proj, '.gitignore'), gitFile)
  alert('.gitognore file update done')
} catch (err) {
  alert('.gitignore file update failed', 'issue')
}

alert('.npmignore file update ongoing')
try {
  fs.writeFileSync(abs(env.proj, '.npmignore'), npmFile)
  alert('.npmignore file update done')
} catch (err) {
  alert('.npmignore file update failed', 'issue')
}
