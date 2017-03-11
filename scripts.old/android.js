


            // Read cordova config file
            read(path.resolve(cfg.packageRoot, 'cordova/config.xml'), 'utf-8', function (err, content) {
              if (err) {
                throw new Error(err)
              } else {

                // Parse cordova config file
                let xmlParser = new xml.Parser()
                xmlParser.parseString(content, function (err, cordovaConfig) {
                  if (err) {
                    throw new Error(err)
                  } else {
                    // Update project id
                    cordovaConfig.widget.$.id = app.playStoreId
                    // Update build version
                    cordovaConfig.widget.$.version = version
                    // Update application name
                    cordovaConfig.widget.name = app.title
                    // Update description
                    if (app.description) {
                      cordovaConfig.widget.description = app.description
                    } else {
                      delete cordovaConfig.widget.description
                    }
                    // Define preferences
                    cordovaConfig.widget.preference = [
                      {
                        $: {
                          name: 'StatusBarStyle',
                          value: app.statusbarTextColor === 'white' ? 'lightcontent' : 'default'
                        }
                      }
                    ]
                    // Add icons and splashscreens
                    cordovaConfig.widget.platform[0].icon = []
                    cordovaConfig.widget.platform[0].splash = []
                    let iconFolder = path.resolve(cfg.packageRoot, 'icons')
                    let icons = list.sync(iconFolder)
                    for (let i = 0; i < icons.length; i++) {
                      let icon = icons[i]
                      if (/android-icon-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/.test(icon)) {
                        cordovaConfig.widget.platform[0].icon.push({
                          $: {
                            src: path.join('..', 'icons', icon),
                            density: icon.match(/android-icon-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[1] + 'dpi'
                          }
                        })
                      } else if (/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/.test(icon)) {
                        let width = icon.match(/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[2]
                        let height = icon.match(/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[3]
                        let dens = icon.match(/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[1]
                        cordovaConfig.widget.platform[0].splash.push({
                          $: {
                            src: path.join('..', 'icons', icon),
                            density: (width > height ? 'port' : 'land') + '-' + dens + 'dpi'
                          }
                        })
                      }
                    }
                    // Build cordova config file
                    let builder = new xml.Builder()
                    let cordovaConfigXml = builder.buildObject(cordovaConfig)
                    // Save cordova config file
                    write(path.resolve(cfg.packageRoot, 'cordova/config.xml'), cordovaConfigXml, function (err) {
                      if (err) {
                        throw new Error(err)
                      } else {
                        callback()
                      }
                    })




                  }
                })
              }
            })
          }
        })
      }
    })
  } else {
    alert(version === '0.0.0' ? 'You must build your application first.' : 'Build folder "www/build-' + version + '" not found.')
  }
}


// Start build process
checkBuild(function () {
  checkIcons(function () {
    createCordovaProject(function () {
      updateCordovaPlugins(function () {
        updateCordovaBuild(function () {
          buildCordovaAndroid(function () {
            alert('Android Studio project version ' + version + ' build, Android Studio is starting ...')
            if (process.platform === 'win32') {
              cmd(path.resolve('C:/Programme/Android/Android Studio/bin'), ['start', 'studio64.exe', '"' + path.resolve(cfg.packageRoot, 'cordova/platforms/android') + '"'], function () {
                alert('Android Studio started with build version ' + version)
              })
            } else {
              run('open -a "/Applications/Android Studio.app" "' + path.resolve(cfg.packageRoot, 'cordova/platforms/android') + '"', function () {
                alert('Android Studio started with build version ' + version)
              })
            }
          })
        })
      })
    })
  })
})
