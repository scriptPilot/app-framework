/* Purpose: Transform Framework7 kitchen sinks into vue page components */

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let found = require('../lib/found')
let fs = require('fs-extra')
let jquery = require('jquery')
let beautify = require('js-beautify')
let jsdom = require('jsdom')
let path = require('path')
let rec = require('recursive-readdir')

// Check App Framework development mode
if (env.installed === true) {
  alert('Kitchen sink update is only possible in App Framework development mode.', 'error')
}

// Define functions
function proceedFolder (sourceFolder, destinationFolder, callback) {
  if (!/(ios|material)$/.test(destinationFolder)) {
    alert('Invalid kitchen sink destination folder.')
  }
  let theme = /ios$/.test(destinationFolder) ? 'ios' : 'material'
  if (!found(sourceFolder)) {
    alert('Cannot find source folder "' + sourceFolder + '".', 'error')
  } else {
    fs.emptyDir(destinationFolder, function (err) {
      if (err) {
        alert('Failed to empty destionation folder "' + destinationFolder + '".', 'error')
      } else {
        rec(sourceFolder, function (err, files) {
          if (err) {
            alert('Failed to read files in source folder.', 'error')
          } else {
            let htmlFiles = []
            files.map(function (file) {
              file = file.substr(sourceFolder.length + 1)
              if (/\.html$/.test(file)) {
                htmlFiles.push(file)
              }
            })
            jsdom.env('', function (err, window) {
              if (err) {
                alert('Failed to initialize JSDom.', 'issue')
              } else {
                let $ = jquery(window)
                let htmlCode = ''
                for (let f = 0; f < htmlFiles.length; f++) {
                  try {
                    let fileContent = fs.readFileSync(path.resolve(sourceFolder, htmlFiles[f]), 'utf8')
                    fileContent = fileContent.replace(/"([0-9a-z-]+)\.html"/g, '"/' + path.basename(destinationFolder) + '/$1/"')
                    fileContent = fileContent.replace(/href="(.+?)" class="back link(| icon-only)?"/g, 'class="back link$2"')
                    $('body').html(fileContent)
                    if (htmlFiles[f] === 'index.html') {
                      $('.popup, .popover, .login-screen, .picker-modal').each(function (i, el) {
                        htmlCode += $(el).prop('outerHTML')
                      })
                      $('.content-block, .content-block-title').remove()
                      $('body').html($('.view-main'))
                      if (theme === 'ios') {
                        $('.navbar .left').addClass('sliding').html('<a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a>')
                        $('.navbar .center').html('iOS')
                      } else if (theme === 'material') {
                        $('.navbar-inner').prepend('<div class="left"><a href="#" class="back link icon-only"><i class="icon icon-back"></i></a></div>')
                        $('.navbar .center').html('Material')
                      }
                    }
                    let page = $('.page')
                    let navbar = $('.navbar')
                    if (page.length !== 1) {
                      alert('File "' + htmlFiles[f] + '" does not contain a unique .page container.', 'error')
                    } else {
                      if ($('.page .navbar').length === 0 && navbar.length > 0) {
                        $('.navbar').remove()
                        $('.page').prepend($(navbar[0]).prop('outerHTML'))
                      }
                      $('.navbar .right').remove()
                      $('.page').addClass('kitchen-sink-' + theme)
                      $('a.back').attr('href', '#')
                      $('a.back span').html('Back')
                      let vueComponent = '<template>\n  ' + beautify.html($('.page').prop('outerHTML'), {indent_size: 2}).replace(/\n/g, '\n  ').replace(/\n([ ]*)\n/g, '\n') + '\n</template>\n'
                      fs.writeFileSync(path.resolve(destinationFolder, htmlFiles[f].replace(/\.html$/, '.vue')), vueComponent)
                    }
                  } catch (err) {
                    alert('Failed to proceed file "' + htmlFiles[f] + '".', 'issue')
                  }
                }
                try {
                  let routes = fs.readJsonSync(path.resolve(env.app, 'routes.json'))
                  let routesNew = []
                  for (let r = 0; r < routes.length; r++) {
                    if ((new RegExp('$\/' + path.basename(sourceFolder) + '\/')).test(routes[r]).path === false) { // eslint-disable-line
                      routesNew.push(routes[r])
                    }
                  }
                  fs.writeJsonSync(path.resolve(env.app, 'routes.json'), routesNew)
                  try {
                    let cssFile = fs.readFileSync(path.resolve(sourceFolder, 'css/kitchen-sink.css'), 'utf8')
                    cssFile = cssFile.replace(/([ ]*)(.+)( \{|,)\n/g, '$1.kitchen-sink-' + theme + ' $2$3')
                    cssFile = cssFile.replace(/\.kitchen-sink-(ios|material) \.page/g, '.kitchen-sink-$1.page')
                    cssFile = beautify.css(cssFile, {indent_size: 2, newline_between_rules: false, end_with_newline: true})
                    fs.writeFileSync(path.resolve(env.app, 'kitchen-sink-' + theme + '.css'), cssFile)
                    try {
                      let jsFile = fs.readFileSync(path.resolve(sourceFolder, 'js/kitchen-sink.js'), 'utf8')
                      jsFile = jsFile.replace(/var myApp = ([\s\S.]+?);/, '')
                      jsFile = jsFile.replace(/var mainView = ([\s\S.]+?);/, '')
                      jsFile = jsFile.replace(/var rightView = ([\s\S.]+?);/, '')
                      jsFile = jsFile.replace(/var \$\$ = Dom7;/, '')
                      jsFile = jsFile.replace(/\$\$\('body'\)\.removeClass\(themes\)\.addClass\('theme-' \+ \$\$\(this\)\.attr\('data-theme'\)\);/, 'vueApp.color = $$$$(this).attr(\'data-theme\');')
                      jsFile = jsFile.replace(/\$\$\('body'\)\.removeClass\(layouts\)\.addClass\('layout-' \+ \$\$\(this\)\.attr\('data-theme'\)\);/, 'vueApp.layout = $$$$(this).attr(\'data-theme\') || \'default\'')
                      jsFile = jsFile.replace(/\$\$\(page\.container\)\.find\('\.ks-color-theme'\)\.click\(function \(\) \{([\s\S.]+?)\}\);/, '$$$$(page.container).find(\'.ks-color-theme\').click(function () { vueApp.color = $$$$(this).attr(\'data-theme\'); });')
                      jsFile = jsFile.replace(/\$\$\(page\.container\)\.find\('\.ks-layout-theme'\)\.click\(function \(\) \{([\s\S.]+?)\}\);/, '$$$$(page.container).find(\'.ks-layout-theme\').click(function () { vueApp.layout = $$$$(this).attr(\'data-theme\') || \'default\' });')
                      jsFile = '/* eslint-disable */\n' +
                               'module.exports = function (vueApp) {\n' +
                               '  var myApp = window.f7;\n' +
                               '  var mainView = null\n' +
                               '  var rightView\n' +
                               '  for (var v = 0; v < myApp.views.length; v++) {\n' +
                               '    if (/^\\.view\\.view-main/.test(myApp.views[v].selector)) {\n' +
                               '      mainView = myApp.views[v]\n' +
                               '    } else if (/^#right-panel-view/.test(myApp.views[v].selector)) {\n' +
                               '      rightView = myApp.views[v]\n' +
                               '    }\n' +
                               '  }\n' +
                               '  if (mainView === null) {\n' +
                               '    myApp.alert("Main view not found.")\n' +
                               '  }\n' +
                               '  if (rightView === null) {\n' +
                               '    myApp.alert("Right panel view not found.")\n' +
                               '  }\n' +
                               '  var $$ = window.Dom7;\n' +
                                  jsFile + '\n' +
                               '}\n'
                      jsFile = beautify.js(jsFile, {indent_size: 2, end_with_newline: true})
                      fs.writeFileSync(path.resolve(env.app, 'kitchen-sink-' + theme + '.js'), jsFile)
                      htmlCode = beautify.html(htmlCode, {indent_size: 2})
                      fs.writeFileSync(path.resolve(env.app, 'kitchen-sink-' + theme + '-html.js'), 'module.exports = \'\' +\n\'' + htmlCode.replace(/\'/g, '\\\'').replace(/\n/g, '\' +\n\'') + '\'\n') // eslint-disable-line
                      callback()
                    } catch (err) {
                      alert('Failed to copy kitchen sink js file.', 'issue')
                    }
                  } catch (err) {
                    alert('Failed to copy kitchen sink css file.', 'issue')
                  }
                } catch (err) {
                  alert('Failed to clean routes.json file.', 'issue')
                }
              }
            })
          }
        })
      }
    })
  }
}

// Run
alert('Updating iOS kitchen sink - please wait ...')
proceedFolder(path.resolve(env.proj, '../Framework7/kitchen-sink-ios'), path.resolve(env.app, 'pages/f7ios'), function () {
  alert('Updating Material kitchen sink - please wait ...')
  proceedFolder(path.resolve(env.proj, '../Framework7/kitchen-sink-material'), path.resolve(env.app, 'pages/f7material'), function () {
    alert('Kitchen sinks updated.')
  })
})
