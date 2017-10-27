/*

  Purpose: Update app/routes.json file according page components.

*/

'use strict'

// Include modules
let env = require('./env')
let alert = require('./alert')
let found = require('./found')
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
    callback([]) // eslint-disable-line
  }
}
let checkRoutes = function (routes, callback) {
  alert('Route check ongoing - please wait ...')
  // Start error array
  let errors = []
  let allRoutes = []
  // Check routes file content
  if (!Array.isArray(routes)) {
    alert('JSON file routes.json must contain an array.', 'error')
  } else {
    // Loop routes
    for (let r = 0; r < routes.length; r++) {
      // Add to all routes
      allRoutes.push({
        path: routes[r].path,
        ident: (r + 1) + '. object'
      })
      // Check route path
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
      // Check route component
      if (routes[r].component === undefined) {
        errors.push((r + 1) + '. object - "component" property missing')
      } else if (/\.vue$/.test(routes[r].component) === false) {
        errors.push((r + 1) + '. object - component property must end with ".vue"')
      } else if (!found(env.app, 'pages', routes[r].component)) {
        errors.push((r + 1) + '. object - page component file "' + routes[r].component + '" not found')
      }
      // Check tabs
      if (routes[r].tabs !== undefined) {
        if (!Array.isArray(routes[r].tabs)) {
          errors.push((r + 1) + '. object - "tab" property must be an array')
        } else {
          for (let t = 0; t < routes[r].tabs.length; t++) {
            // Define shortlinks
            let tab = routes[r].tabs[t]
            let tabIdent = (r + 1) + '. object / ' + (t + 1) + '. tab'
            // Add to all routes
            allRoutes.push({
              path: (routes[r].path + tab.path).replace(/\/\//g, '/'),
              ident: tabIdent
            })
            // Check path
            if (tab.path === undefined) {
              errors.push(tabIdent + ' - "path" property missing')
            } else if (/^(\/|(\/(.+)\/))$/.test(tab.path) === false) {
              errors.push(tabIdent + ' - path property must start and end with a slash')
            } else {
              for (let t2 = 0; t2 < routes[r].tabs.length; t2++) {
                if (routes[r].tabs[t2].path === routes[r].tabs[t].path && t2 !== t) {
                  errors.push(tabIdent + ' - path must be unique (found in ' + (t2 + 1) + '. tab)')
                }
              }
            }
            // Check tabId
            if (tab.tabId === undefined) {
              errors.push(tabIdent + ' - "tabId" property missing')
            } else {
              for (let t2 = 0; t2 < routes[r].tabs.length; t2++) {
                if (routes[r].tabs[t2].tabId === routes[r].tabs[t].tabId && t2 !== t) {
                  errors.push(tabIdent + ' - tabId must be unique (found in ' + (t2 + 1) + '. tab)')
                }
              }
            }
            // Check component
            if (tab.component === undefined) {
              errors.push(tabIdent + ' - "component" property missing')
            } else if (/\.vue$/.test(tab.component) === false) {
              errors.push(tabIdent + ' - component property must end with ".vue"')
            } else if (!found(env.app, 'pages', tab.component)) {
              errors.push(tabIdent + ' - page component file "' + tab.component + '" not found')
            }
            // Check alternate tabs
            if (tab.routes !== undefined) {
              if (!Array.isArray(routes[r].tabs)) {
                errors.push(tabIdent + '"routes" property must be an array')
              } else {
                for (let a = 0; a < tab.routes.length; a++) {
                  // Define shortlinks
                  let aTab = tab.routes[a]
                  let aTabIdent = (r + 1) + '. object / ' + (t + 1) + '. tab / ' + (a + 1) + '. route'
                  // Add to all routes
                  allRoutes.push({
                    path: (routes[r].path + tab.path + aTab.path).replace(/\/\//g, '/'),
                    ident: aTabIdent
                  })
                  // Check path
                  if (aTab.path === undefined) {
                    errors.push(aTabIdent + ' - "path" property missing')
                  } else if (/^(\/|(\/(.+)\/))$/.test(aTab.path) === false) {
                    errors.push(aTabIdent + ' - path property must start and end with a slash')
                  } else {
                    for (let a2 = 0; a2 < tab.routes.length; a2++) {
                      if (tab.routes[a2].path === tab.routes[a].path && a2 !== a) {
                        errors.push(aTabIdent + ' - path must be unique (found in ' + (a2 + 1) + '. route)')
                      }
                    }
                  }
                  // Check component
                  if (aTab.component === undefined) {
                    errors.push(aTabIdent + ' - "component" property missing')
                  } else if (/\.vue$/.test(aTab.component) === false) {
                    errors.push(aTabIdent + ' - component property must end with ".vue"')
                  } else if (!found(env.app, 'pages', aTab.component)) {
                    errors.push(aTabIdent + ' - page component file "' + aTab.component + '" not found')
                  }
                  // Check other route props
                  for (let prop in aTab) {
                    if (prop !== 'path' && prop !== 'component' && prop !== 'login') {
                      errors.push(aTabIdent + ' - property "' + prop + '" not allowed')
                    }
                  }
                }
              }
            }
            // Check other route props
            for (let prop in tab) {
              if (prop !== 'path' && prop !== 'tabId' && prop !== 'component' && prop !== 'routes' && prop !== 'login') {
                errors.push(tabIdent + ' - property "' + prop + '" not allowed')
              }
            }
          }
        }
      }
      // Check other route props
      for (let prop in routes[r]) {
        if (prop !== 'path' && prop !== 'component' && prop !== 'tabs' && prop !== 'login') {
          errors.push((r + 1) + '. object - property "' + prop + '" not allowed')
        }
      }
    }
  }
  // Check all routes paths for dublications
  for (let r = 0; r < allRoutes.length; r++) {
    for (let r2 = 0; r2 < allRoutes.length; r2++) {
      if (allRoutes[r].path === allRoutes[r2].path && r !== r2) {
        errors.push('Same route: "' + allRoutes[r].path + '" (' + allRoutes[r].ident + ' and ' + allRoutes[r2].ident + ')')
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
    // List page files
    let tabsFolder = path.resolve(env.app, 'pages')
    rec(tabsFolder, function (err, tabs) {
      if (err) {
        alert('Failed to read tabs folder.', 'issue')
      } else {
        // Loop page files to add standard tabs
        for (let t = 0; t < tabs.length; t++) {
          // Check for one underscore
          let tabFile = tabs[t].substr(tabsFolder.length + 1)
          let tabSearch = tabFile.match(/^([0-9a-z/-]+)_([0-9a-z/-]+)\.vue$/)
          // Underscore found
          if (tabSearch !== null) {
            let tabPath = '/' + tabSearch[2] + '/'
            let pagePath = '/' + tabSearch[1] + '/'
            // Search page index
            let pageNo = us.findIndex(routes, {path: pagePath})
            // Page not found in routes
            if (pageNo === -1) {
              alert(tabSearch[0] + ' indicates a tab component.\nPage component "' + tabSearch[1] + '.vue" is missing.', 'error')
            // Page found in routes
            } else {
              // Add tabs array to page route if not exist
              if (routes[pageNo].tabs === undefined) {
                routes[pageNo].tabs = []
              }
              // Add missing tab route
              if (us.findIndex(routes[pageNo].tabs, {component: tabSearch[0]}) === -1) {
                routes[pageNo].tabs.push({
                  path: tabPath,
                  tabId: tabSearch[2],
                  component: tabSearch[0]
                })
              }
              // Sort tab routes by path
              routes[pageNo].tabs = us.sortBy(routes[pageNo].tabs, 'path')
            }
          }
        }
        // Loop page files to add alternate tabs
        for (let t = 0; t < tabs.length; t++) {
          // Check for two underscores
          let tabFile = tabs[t].substr(tabsFolder.length + 1)
          let tabSearch = tabFile.match(/^([0-9a-z/-]+)_([0-9a-z/-]+)_([0-9a-z/-]+)\.vue$/)
          // Two underscores found
          if (tabSearch !== null) {
            let alternateTabPath = '/' + tabSearch[3] + '/'
            let tabPath = '/' + tabSearch[2] + '/'
            let pagePath = '/' + tabSearch[1] + '/'
            // Search page index
            let pageNo = us.findIndex(routes, {path: pagePath})
            // Page not found in routes
            if (pageNo === -1) {
              alert(tabSearch[0] + ' indicates a tab component.\nPage component "' + tabSearch[1] + '.vue" is missing.', 'error')
            // Page found in routes
            } else {
              // Search tab index
              let tabNo = us.findIndex(routes[pageNo].tabs, {path: tabPath})
              // Tab not found in page route
              if (tabNo === -1) {
                alert(tabSearch[0] + ' indicates an alternate tab component.\nTab page component "' + tabSearch[1] + '_' + tabSearch[2] + '.vue" is missing.', 'error')
              // Tab found in routes
              } else {
                // Add tabs array to page route if not exist
                if (routes[pageNo].tabs[tabNo] === undefined) {
                  routes[pageNo].tabs[tabNo] = []
                }
                // Add sub routes to tab route if not exist
                if (routes[pageNo].tabs[tabNo].routes === undefined) {
                  routes[pageNo].tabs[tabNo].routes = []
                }
                // Add missing tab route
                if (us.findIndex(routes[pageNo].tabs[tabNo].routes, {component: tabSearch[0]}) === -1) {
                  routes[pageNo].tabs[tabNo].routes.push({
                    path: alternateTabPath,
                    component: tabSearch[0]
                  })
                }
                // Sort alternate tab routes by path
                routes[pageNo].tabs[tabNo].routes = us.sortBy(routes[pageNo].tabs[tabNo].routes, 'path')
              }
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
