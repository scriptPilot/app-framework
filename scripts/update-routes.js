/*

  Purpose: Update app/routes.json file according page components.

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let found = require('../lib/found')
let fs = require('fs-extra')
let path = require('path')
let rec = require('recursive-readdir')
let us = require('underscore')

// Steps
let loadRoutes = function (callback) {
  alert('Route loading ongoing - please wait ...')
  let file = path.resolve(env.app, 'routes.json')
  if (found(file)) {
    fs.readJson(file, function (err, json) {
      if (err) {
        alert('Route loading failed. Please check the app/routes.json file.', 'error')
      } else {
        alert('Route loading done.')
        callback(json)
      }
    })
  } else {
    callback([])
  }
}
let checkRoutes = function (routes, callback) {
  alert('Route check ongoing - please wait ...')
  let errors = []
  if (!Array.isArray(routes)) {
    alert('JSON file routes.json must contain an array.', 'error')
  } else {
    for (let r = 0; r < routes.length; r++) {
      if (routes[r].path === undefined) {
        errors.push((r + 1) + '. object - "path" property missing')
      } else if (/^(\/|(\/(.+)\/))$/.test(routes[r].path) === false) {
        errors.push((r + 1) + '. object - path property must start and end with a slash')
      } else {
        for (let r2 = 0; r2 < routes.length; r2++) {
          if (routes[r2].path === routes[r].path && r2 !== r) {
            errors.push((r + 1) + '. object - path must be unique (found in ' + (r2 + 1) + '. object)')
          }
        }
      }
      if (routes[r].component === undefined) {
        errors.push((r + 1) + '. object - "component" property missing')
      } else if (/\.vue$/.test(routes[r].component) === false) {
        errors.push((r + 1) + '. object - component property must end with ".vue"')
      } else if (!found(env.app, 'pages', routes[r].component)) {
        errors.push((r + 1) + '. object - page component file "' + routes[r].component + '" not found')
      }
      for (let prop in routes[r]) {
        if (prop !== 'path' && prop !== 'component' && prop !== 'tabs') {
          errors.push((r + 1) + '. object - property "' + prop + '" not allowed')
        }
      }
    }
  }
  if (errors.length === 0) {
    callback()
  } else {
    alert('Please correct the file app/routes.json\n\n' + errors.join('\n'), 'error')
  }
}
let addMissingTabs = function (routes, callback) {
  if (env.cfg.completeRoutesFile === true) {
    alert('Adding missing tab routes - please wait ...')
    let tabsFolder = path.resolve(env.app, 'pages')
    rec(tabsFolder, function (err, tabs) {
      if (err) {
        alert('Failed to read tabs folder.', 'issue')
      } else {
        for (let t = 0; t < tabs.length; t++) {
          let tabFile = tabs[t].substr(tabsFolder.length + 1)
          let tabSearch = tabFile.match(/^([0-9a-z/-]+)_([0-9a-z/-]+)\.vue$/)
          if (tabSearch !== null) {
            let tabPath = '/' + tabSearch[2] + '/'
            let pagePath = '/' + tabSearch[1] + '/'
            let pageNo = us.findIndex(routes, {path: pagePath})
            if (pageNo === -1) {
              alert(tabSearch[0] + ' indicates a tab component.\nPage component "' + tabSearch[1] + '.vue" is missing.')
            } else {
              if (routes[pageNo].tabs === undefined) {
                routes[pageNo].tabs = []
              }
              if (us.findIndex(routes[pageNo].tabs, {component: tabSearch[0]}) === -1) {
                routes[pageNo].tabs.push({
                  path: tabPath,
                  tabId: tabSearch[2],
                  component: tabSearch[0]
                })
              }
              routes[pageNo].tabs = us.sortBy(routes[pageNo].tabs, 'path')
            }
          }
        }
        callback(routes)
      }
    })
  } else {
    callback(routes)
  }
}
let addMissingPages = function (routes, callback) {
  if (env.cfg.completeRoutesFile === true) {
    alert('Add missing page routes ongoing - please wait ...')
    let pagesFolder = path.resolve(env.app, 'pages')
    rec(pagesFolder, function (err, pages) {
      if (err) {
        alert('Failed to read pages folder.', 'issue')
      } else {
        for (let p = 0; p < pages.length; p++) {
          let pageFile = pages[p].substr(pagesFolder.length + 1).replace(/\\/g, '/')
          if (/^([0-9a-z-/]+)\.vue$/.test(pageFile)) {
            let pagePath = '/' + pageFile.replace(/\.vue$/, '') + '/'
            let pagePathFound = false
            for (let r = 0; r < routes.length; r++) {
              if (routes[r].path === pagePath) {
                pagePathFound = true
              }
            }
            if (pagePathFound === false) {
              routes.push({
                path: pagePath,
                component: pageFile
              })
            }
          }
        }
        alert('Add missing page routes done.')
        callback(routes)
      }
    })
  } else {
    callback(routes)
  }
}
let saveRoutes = function (routes, callback) {
  alert('Saving routes.json file - please wait ...')
  let file = path.resolve(env.app, 'routes.json')
  routes = us.sortBy(routes, 'path')
  fs.writeJson(file, routes, function (err) {
    if (err) {
      alert('Saving routes.json file failed.', 'issue')
    } else {
      alert('Saving routes.json file done.')
      callback()
    }
  })
}

// Run
alert('Route update ongoing - please wait ...')
loadRoutes(function (routes) {
  checkRoutes(routes, function () {
    addMissingPages(routes, function (routes) {
      addMissingTabs(routes, function (routes) {
        saveRoutes(routes, function () {
          alert('Route update done.')
        })
      })
    })
  })
})
