/* Purpose: Remember and restore the application state */

'use strict'

module.exports = function () {
  // Define shortcuts
  let $$ = window.Dom7
  let f7 = window.f7
  let ls = window.localStorage
  // Define functions
  let getViewSel = function (e) {
    let viewEl = $$(e.target).parents('.view')[0]
    let viewSel = (viewEl.id && viewEl.id !== '' ? '#' + viewEl.id : '') + (viewEl.className ? '.' + viewEl.className.replace(/ /, '.') : '')
    return viewSel
  }
  let restorePanel = function (callback) {
    if (ls.panel === 'left' || ls.panel === 'right') {
      setTimeout(function () {
        f7.openPanel(ls.panel === 'left' ? 'left' : 'right', false)
        callback()
      }, 0)
    } else {
      delete ls.panel
      callback()
    }
  }
  let restoreUrls = function (viewId, urls, callback, urlId) {
    urlId = urlId || 0
    if (Array.isArray(urls) && urlId < urls.length) {
      setTimeout(function () {
        f7.views[viewId].router.load({url: urls[urlId], animatePages: false})
        restoreUrls(viewId, urls, callback, urlId + 1)
      }, 0)
    } else {
      callback()
    }
  }
  let restoreViews = function (callback, viewId) {
    viewId = viewId || 0
    if (viewId < f7.views.length) {
      let urls = ls['urls|' + f7.views[viewId].selector] ? JSON.parse(ls['urls|' + f7.views[viewId].selector]) : []
      restoreUrls(viewId, urls, function () {
        restoreViews(callback, viewId + 1)
      })
    } else {
      callback()
    }
  }
  let restoreState = function (callback) {
    restoreViews(function () {
      restorePanel(function () {
        callback()
      })
    })
  }
  let rememberState = function () {
    // Ensure DOM update before
    setTimeout(function () {
      // Remember URLs
      $$(document).on('page:init page:reinit', function (e) {
        // Get URL without beginning/ending slash
        let url = e.detail.page.url.match(/^(\/)?(.+?)(\/)?$/)[2]
        // Get view selector
        let viewSel = getViewSel(e)
        // Get current URLs from local storage or start new array
        let urls = ls['urls|' + viewSel] !== undefined ? JSON.parse(ls['urls|' + viewSel]) : []
        if (!Array.isArray(urls)) {
          urls = []
        }
        // Add new page to array
        if (e.type === 'page:init' && e.detail.page.url.substr(0, 9) !== '#content-') {
          urls.push(url)
        // Remove page from array
        } else if (e.type === 'page:reinit' && e.detail.page.fromPage && e.detail.page.fromPage.url.substr(0, 9) !== '#content-' && urls.length > 0) {
          urls.pop()
        }
        // Update local storage
        if (JSON.stringify(urls) !== '[]') {
          ls['urls|' + viewSel] = JSON.stringify(urls)
        // Remove local storage
        } else {
          delete ls['urls|' + viewSel]
        }
      })
      // Remember tabs
      $$(document).on('tab:show', function (e) {
        let tabId = e.target.id
        let url = ''
        let viewSel = getViewSel(e)
        console.log(tabId, url, viewSel, e)
      })
      // Remember panel
      $$(document).on('panel:opened panel:closed', function (e) {
        // Save panel in local storage
        if (e.type === 'panel:opened') {
          console.log(e)
          ls.panel = /panel panel-left /.test(e.path[0]._prevClass) === true ? 'left' : 'right'
        // Remove panel from local storage
        } else {
          delete ls.panel
        }
      })
    }, 0)
  }
  // Run
  restoreState(function () {
    rememberState()
  })
}
