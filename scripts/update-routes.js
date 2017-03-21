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
      }
      if (routes[r].component === undefined) {
        errors.push((r + 1) + '. object - "component" property missing')
      } else if (/\.vue$/.test(routes[r].component) === false) {
        errors.push((r + 1) + '. object - component property must end with ".vue"')
      } else if (!found(env.app, 'pages', routes[r].component)) {
        errors.push((r + 1) + '. object - page component file "' + routes[r].component + '" not found')
      }
    }
  }
  if (errors.length === 0) {
    callback()
  } else {
    alert((errors.length > 1 ? 'Some errors' : 'Error') + ' found in routes.json file:\n- ' + errors.join('\n- '), 'error')
  }
}
let addMissingPages = function (routes, callback) {
  alert('Add missing page routes ongoing - please wait ...')
  let pagesFolder = path.resolve(env.app, 'pages')
  rec(pagesFolder, function (err, pages) {
    if (err) {
      alert('Failed to read pages folder.', 'issue')
    } else {
      for (let p = 0; p < pages.length; p++) {
        let pageFile = pages[p].substr(pagesFolder.length + 1)
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
      alert('Add missing page routes done.')
      callback(routes)
    }
  })
}
let saveRoutes = function (routes, callback) {
  alert('Saving routes.json file - please wait ...')
  let file = path.resolve(env.app, 'routes.json')
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
      saveRoutes(routes, function () {
        alert('Route update done.')
      })
    })
  })
})
