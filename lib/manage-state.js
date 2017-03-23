'use strict'

/* recode! */

module.exports = function () {
  // Define shortcuts
  let $$ = window.Dom7
  let f7 = window.f7
  let LS = window.localStorage
  // Define functions
  let restoreState = function (cb) {
    console.log('restore state')
    restoreView(cb)
  }
  let restoreView = function (cb, viewId) {
    viewId = viewId || 0
    if (viewId >= f7.views.length) {
      cb()
    } else {
      console.log('restore view id ' + viewId)
      restoreUrl(viewId, function () {
        restoreView(cb, viewId + 1)
      })
    }
  }
  let restoreUrl = function (viewId, cb, urls, urlId) {
    urls = urls || []
    try {
      urls = JSON.parse(LS['urlsPerView|' + f7.views[viewId].selector])
      if (!Array.isArray(urls)) {
        throw new Error
      }
    } catch (err) {
      delete LS['urlsPerView|' + f7.views[viewId].selector]
    }
    urlId = urlId || 0
    if (urlId >= urls.length) {
      cb()
    } else {
      console.log('restore view ' + viewId + ', url ' + urlId)
      restoreUrl(viewId, cb, urls, urlId + 1)
    }
  }
  let rememberState = function () {
    // Remember urls
    $$(document).on('page:init page:reinit', function (e) {
      let url = e.detail.page.url.match(/^(\/)?(.+?)(\/)?$/)[2]
      let viewEl = $$(e.target).parents('.view')[0]
      let viewSel = (viewEl.id && viewEl.id !== '' ? '#' + viewEl.id : '') + (viewEl.className ? '.' + viewEl.className.replace(/ /, '.') : '')
      let urls = LS['urlsPerView|' + viewSel] !== undefined ? JSON.parse(LS['urlsPerView|' + viewSel]) : []
      if (!Array.isArray(urls)) {
        urls = []
      }
      if (e.type === 'page:init' && e.detail.page.url.substr(0, 9) !== '#content-') {
        urls.push(url)
      } else if (e.type === 'page:reinit' && e.detail.page.fromPage && e.detail.page.fromPage.url.substr(0, 9) !== '#content-' && urls.length > 0) {
        urls.pop()
      }
      if (JSON.stringify(history) !== '[]') {
        LS['urlsPerView|' + viewSel] = JSON.stringify(history)
      } else {
        delete LS['urlsPerView|' + viewSel]
      }
    })
  }
  // Run
  restoreState(function () {
    console.log('restore state done')
    rememberState()
  })
}
