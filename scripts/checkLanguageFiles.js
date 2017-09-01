// Purpose: Check language files, compare to default language file and sort each file by keys

// Load modules
const env = require('./env')
const alert = require('./alert')
const found = require('./found')
const fs = require('fs-extra')
const path = require('path')
const abs = require('path').resolve
const rec = require('recursive-readdir-sync')
const sort = require('sort-keys-recursive')

// Define language folder
const langFolder = abs(env.app, 'lang')

// Check if default language file exists
const defaultLangFile = abs(langFolder, env.cfg.defaultLanguage + '.json')
if (!found(defaultLangFile)) {
  alert(`Default language file lang/${env.cfg.defaultLanguage}.json not found.`, 'error')
}

// Check if all language files are valid and sort each by key
const langPatterns = {}
try {
  const files = rec(langFolder)
  files.forEach((file) => {
    const patterns = fs.readJsonSync(file)
    const language = path.basename(file).slice(0, -5)
    langPatterns[language] = patterns
    fs.writeJsonSync(file, sort(patterns), { spaces: 2 })
  })
} catch (err) {
  alert('Failed to read language files.', 'issue')
}

// Check all files if they have flat key:string pairs
for (let lang in langPatterns) {
  let errors = 0
  for (let key in langPatterns[lang]) {
    if (typeof langPatterns[lang][key] !== 'string') {
      errors++
    }
  }
  if (errors > 0) {
    alert(`Language file lang/${lang}.json should contain plain key:string pairs.`, 'error')
  }
}

// Compare languages files to default language file
// Loop all languages
for (let lang in langPatterns) {
  // It's not the default language
  if (lang !== env.cfg.defaultLanguage) {
    const diffs = []
    // Loop all items of the default language
    if (env.cfg.defaultLanguageFallback === false) {
      for (let key in langPatterns[env.cfg.defaultLanguage]) {
        // Missing items
        if (langPatterns[lang][key] === undefined) {
          diffs.push(`"${key}" is missing`)
        }
      }
    }
    // Loop all items of the second language
    for (let key in langPatterns[lang]) {
      // Too much items
      if (langPatterns[env.cfg.defaultLanguage][key] === undefined) {
        diffs.push(`"${key}" is too much`)
      }
    }
    // Differences found
    if (diffs.length > 0) {
      alert(`Language file lang/${lang}.json is different to the default one:\n- ` + diffs.join('\n- '), 'error')
    }
  }
}
