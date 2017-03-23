/* Purpose: Remember and restore application state */

'use strict'

module.exports = {
  mounted: function () {
    // Define shortcuts
    let $$ = window.Dom7
    let f7 = window.f7
    let _ = window._
    // Define functions
    let rememberState = function () {
      // Remember history
      $$(document).on('page:init page:reinit', function (e) {
        let url = e.detail.page.url.match(/^(\/)?(.+?)(\/)?$/)[2]
        let viewEl = $$(e.target).parents('.view')[0]
        let viewSel = (viewEl.id && viewEl.id !== '' ? '#' + viewEl.id : '') + (viewEl.className ? '.' + viewEl.className.replace(/ /, '.') : '')
        let history = window.localStorage['history|' + viewSel] ? JSON.parse(window.localStorage['history|' + viewSel]) : []
        if (e.type === 'page:init' && e.detail.page.url.substr(0, 9) !== '#content-') {
          history.push(url)
        } else if (e.type === 'page:reinit' && e.detail.page.fromPage && e.detail.page.fromPage.url.substr(0, 9) !== '#content-') {
          history.pop()
        }
        if (JSON.stringify(history) !== '[]') {
          window.localStorage['history|' + viewSel] = JSON.stringify(history)
        } else {
          delete window.localStorage['history|' + viewSel]
        }
      })
      // Remember panel
      $$(document).on('panel:opened panel:closed', function (e) {
        if (e.type === 'panel:opened') {
          window.localStorage.panel = /panel panel-left /.test(e.path[0]._prevClass) === true ? 'left' : 'right'
        } else {
          delete window.localStorage.panel
        }
      })
      // Remember form focus
      $$(document).on('focusin focusout', function (e) {
        if (e.type === 'focusin' && e.target.form && e.target.form.id && e.target.form.id !== '' && e.target.name && e.target.name !== '') {
          window.localStorage.formFocus = 'form#' + e.target.form.id + ' [name=' + e.target.name + ']'
        } else if (e.type === 'focusout') {
          delete window.localStorage.formFocus
        }
      })
    }
    let restoreState = function (callback) {
      restoreHistory(function () {
        restorePanel(function () {
          callback()
        })
      })
    }
    let restoreHistory = function (callback, oldState) {
      if (oldState === undefined) {
        oldState = []
        let object = JSON.parse(JSON.stringify(window.localStorage))
        for (let key in object) {
          oldState.push({
            key: key,
            value: object[key]
          })
        }
      }
      if (!Array.isArray(oldState) || oldState.length === 0) {
        callback()
      } else {
        let oldStateItem = oldState.shift()
        if (/^history\|/.test(oldStateItem.key) === false) {
          callback()
        } else {
          setTimeout(function () {
            let viewSel = oldStateItem.key.substr(8)
            let viewNo = _.findIndex(f7.views, {selector: viewSel})
            if (viewNo === -1) {
              delete window.localStorage[oldStateItem.key]
              restoreHistory(callback, oldState)
            } else {
              try {
                let urls = JSON.parse(oldStateItem.value)
                restoreUrls(urls, viewNo, function () {
                  restoreHistory(callback, oldState)
                })
              } catch (err) {
                delete window.localStorage[oldStateItem.key]
                restoreHistory(callback, oldState)
              }
            }
          }, 0)
        }
      }
    }
    let restoreUrls = function (urls, viewNo, callback) {
      if (!Array.isArray(urls) || urls.length === 0) {
        callback()
      } else {
        setTimeout(function () {
          f7.views[viewNo].router.load({url: urls.shift(), animatePages: false})
          setTimeout(function () {
            restoreUrls(urls, viewNo, callback)
          }, 0)
        }, 0)
      }
    }
    let restorePanel = function (callback) {
      if (window.localStorage.panel === 'left' || window.localStorage.panel === 'right') {
        // setTimeout(function () {
        f7.openPanel(window.localStorage.panel === 'left' ? 'left' : 'right', false)
        callback()
        // }, 0)
      } else {
        delete window.localStorage.panel
        callback()
      }
    }
    // Run
    restoreState(function () {
      rememberState()
    })
  }
}
