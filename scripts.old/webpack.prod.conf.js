
/*

// Create and save manifest (see http://realfavicongenerator.net/faq for details)
let manifest = {
  name: app.title,
  icons: [
    {
      'src': 'android-chrome-192x192.png',
      'sizes': '192x192',
      'type': 'image/png'
    },
    {
      'src': 'android-chrome-512x512.png',
      'sizes': '512x512',
      'type': 'image/png'
    }
  ],
  theme_color: app.iconBackgroundColor,
  background_color: app.iconBackgroundColor,
  display: 'standalone'
}



    new OnBuildPlugin(function (stats) {
      // Save manifest file
      write.sync(path.resolve(cfg.appRoot, 'www/build-' + app.version, 'manifest.json'), JSON.stringify(manifest))

      // Save browserconfig file
      let xml = '<?xml version="1.0" encoding="utf-8"?>' +
                '<browserconfig>' +
                  '<msapplication>' +
                    '<tile>' +
                      '<square150x150logo src="mstile-150x150.png"/>' +
                      '<TileColor>#da532c</TileColor>' +
                    '</tile>' +
                  '</msapplication>' +
                '</browserconfig>'
      write.sync(path.resolve(cfg.appRoot, 'www/build-' + app.version, 'browserconfig.xml'), xml)

      // Copy icon files (see http://realfavicongenerator.net/faq for details)
      copy(path.resolve(cfg.packageRoot, 'icons/favicon-*'), path.resolve(cfg.appRoot, 'www/build-' + app.version))
      copy(path.resolve(cfg.packageRoot, 'icons/android-chrome-*'), path.resolve(cfg.appRoot, 'www/build-' + app.version))
      copy(path.resolve(cfg.packageRoot, 'icons/mstile-*'), path.resolve(cfg.appRoot, 'www/build-' + app.version))
      copy(path.resolve(cfg.packageRoot, 'icons/apple-touch-icon-*'), path.resolve(cfg.appRoot, 'www/build-' + app.version))

      // Rename Apple touch icon
      rename(path.resolve(cfg.appRoot, 'www/build-' + app.version, 'apple-touch-icon-180x180.png'), path.resolve(cfg.appRoot, 'www/build-' + app.version, 'apple-touch-icon.png'))

      // Compress images
      let images = list(path.resolve(cfg.appRoot, 'www/build-' + app.version + '/img'))
      for (let i = 0; i < images.length; i++) {
        console.log('Compress ' + images[i])
      }


      // Delete Framework7 icon from CSS file
      deleteFiles([path.resolve(cfg.appRoot, 'www/build-' + app.version, 'i-f7-ios*')])

      // Delete .babelrc file
      if (cfg.isInstalled && found(cfg.projectRoot + '.babelrc')) {
        fs.remove(cfg.projectRoot + '.babelrc')
      }
    })

    */
