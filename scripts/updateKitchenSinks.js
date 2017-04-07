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
                for (let f = 0; f < htmlFiles.length; f++) {
                  try {
                    let fileContent = fs.readFileSync(path.resolve(sourceFolder, htmlFiles[f]), 'utf8')
                    fileContent = fileContent.replace(/"([0-9a-z-]+)\.html"/g, '"/' + path.basename(destinationFolder) + '/$1/"')
                    fileContent = fileContent.replace(/href="\/f7(ios|material)\/index\/" class="back link(| icon-only)?"/g, 'class="back link$2"')
                    $('body').html(fileContent)
                    if (htmlFiles[f] === 'index.html') {
                      $('body').html($('.view-main'))
                      if (/ios$/.test(destinationFolder)) {
                        $('.navbar .left').addClass('sliding').html('<a class="back link"><i class="icon icon-back"></i><span>Back</span></a>')
                        $('.navbar .center').html('iOS')
                      } else if (/material$/.test(destinationFolder)) {
                        $('.navbar-inner').prepend('<div class="left"><a class="back link icon-only"><i class="icon icon-back"></i></a></div>')
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
                      let vueComponent = beautify.html('<template>' + $('.page').prop('outerHTML') + '</template>')
                      fs.writeFileSync(path.resolve(destinationFolder, htmlFiles[f].replace(/\.html$/, '.vue')), vueComponent)
                    }
                  } catch (err) {
                    alert('Failed to proceed file "' + htmlFiles[f] + '".' + err, 'issue')
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
                  callback()
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
