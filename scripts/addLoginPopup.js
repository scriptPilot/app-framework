// Purpose: Add missing login popup to app.vue file

// Import modules
const env = require('./env')
const alert = require('./alert')
const abs = require('path').resolve
const fs = require('fs-extra')

// Run
fs.readFile(abs(env.app, 'app.vue'), {encoding: 'utf8'}, (err, str) => {
  if (err) alert('Failed to read app.vue file', 'issue')
  const appElementFound = str.match(/<div(.*)id="app"(.*)>/)
  const loginPopupElementFound = str.match(/<login-popup \/>/)
  if (!appElementFound) {
    alert('No #app element found in the app.vue file. Please read the documentation.', 'error')
  } else if (!loginPopupElementFound) {
    const newStr = str.replace(/<div(.*)id="app"(.*)>/, '<div$1id="app"$2>\n    <login-popup />')
    fs.writeFile(abs(env.app, 'app.vue'), newStr, (err) => {
      if (err) alert('Failed to write app.vue file.', 'issue')
      alert('Updated app.vue file.')
    })
  }
})
