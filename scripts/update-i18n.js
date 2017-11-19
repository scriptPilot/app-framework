/*

  Purpose: Update app/lang/[locale].json file according language keys.

*/

'use strict'

// Include modules
let env = require('./env')
let alert = require('./alert')
let found = require('./found')
let fs = require('fs-extra')
let path = require('path')
let rec = require('recursive-readdir')
let sort = require('sort-keys-recursive')

/**
 * Load i18n reference file
 * @param {string} lang
 */
function loadI18nFile(lang) {
  alert(`Loading keys in lang/${lang}.json file in progress ...`)
  return new Promise((resolve, reject) => {
    let file = path.resolve(env.app, `lang/${lang}.json`)
    if (found(file)) {
      fs.readJson(file, function (err, json) {
        if (err) {
          reject(`Keys loading failed. Please check the lang/${lang}.json file.`)
        } else {
          resolve(json)
        }
      })
    } else {
      reject('File not found')
    }
  })
}
/**
 * Scan pages , in order to find keys
 */
function scanPages() {
  alert('Scan project pages in progress ...')
  return new Promise((resolve, reject) => {
    let pagesFolder = path.resolve(env.app, 'pages')
    let componentsFolder = path.resolve(env.app, 'components')
    let appFile = path.resolve(env.app, 'app.vue')
    const regex = /\$lang\(['''|'"'](.*?)['''|'"'](?:[ ]*,?[ ]*\{.*\})?\)/g;
    let pathKeys = []
    let paths = [pagesFolder, componentsFolder]
    let promiseTab = []
    paths.forEach(p => {
      if (found(p)) {
        promiseTab.push(rec(p))
      }
    })
    Promise.all(promiseTab).then(res => {
      res.push([appFile])
      res.map(pages => {
        let keys = []
        for (let p = 0; p < pages.length; p++) {
          let str = fs.readFileSync(pages[p], 'utf8')
          let m
          while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            keys.push(m[1])
          }
        }
        pathKeys = pathKeys.concat(keys)
      })
      resolve(pathKeys)
    }, err => {
      reject('Failed to read pages folder.')
    })
  })
}

/**
 *
 * @param {Object} storedKeys
 * @param {array} newKeys
 */
function diffKeys(storedKeys, newKeys, newKey = true) {
  let msg = 'Finding new keys in progress ...'
  if (!newKey) {
    msg = 'Finding deleted keys in progress ...'
  }
  alert(msg)
  return new Promise((resolve, reject) => {
    let keys
    if (newKey) {
      keys = newKeys.filter(k => {
        return !storedKeys[k]
      })
    } else {
      keys = Object.keys(storedKeys).filter(k => {
        return !newKeys.includes(k)
      })
    }
    resolve(keys)
  })
}
/**
 * Save new keys in i18n file
 *
 * @param {Object} storedKeys
 * @param {array} diffKeysToSave
 * @param {array} diffKeysToDelete
 * @param {Object} params
 */
function saveKeys(storedKeys, diffKeysToSave, diffKeysToDelete, params) {
  let lang = params.lang || env.cfg.defaultLanguage
  let prefix = params.prefix || '__'
  return new Promise((resolve, reject) => {
    let ObjDiffKeys = {}
    diffKeysToSave.forEach(key => {
      ObjDiffKeys[key] = `${prefix}${key}`
    })
    diffKeysToDelete.forEach(key => {
      delete storedKeys[key]
    })
    let keysToStore = Object.assign(storedKeys, ObjDiffKeys)
    let file = path.resolve(env.app, `lang/${lang}.json`)
    try {
      fs.writeJsonSync(file, sort(keysToStore), { spaces: 2 })
      resolve(true)
    } catch (error) {
      reject(`An error occure when saving ${lang}.json file`)
    }
  })
}
// Run
let lang = env.arg.lang || env.cfg.defaultLanguage
let prefix = env.arg.prefix || '__'

//Step 1 : Load lang/[locale].json file
loadI18nFile(lang).then(storedKeys => {
  alert(`Keys loading in file ${lang}.json done.`)
  //Step 2 : Scan project pages
  scanPages().then(newKeys => {
    alert('Scanning done')
    //Step 3 : Find new Keys
    diffKeys(storedKeys, newKeys).then(diffKeysToSave => {
      alert(`${diffKeysToSave.length} new keys to save`)
      //Step 4 : Find Keys to delete
      diffKeys(storedKeys, newKeys, false).then(diffKeysToDelete => {
        alert(`${diffKeysToDelete.length} new keys to delete`)
        //Step 5 : Save keys in [locale].json file
        saveKeys(storedKeys, diffKeysToSave, diffKeysToDelete, { lang, prefix }).then(saved => {
          alert(`I18n Keys saved in ${lang}.json`)
        }, err => {
          alert(err, 'error')
        })
      }, err => {
        alert(err, 'error')
      })
    }, err => {
      alert(err, 'error')
    })
  }, err => {
    alert(err, 'error')
  })
}, err => {
  alert(err, 'error')
})
