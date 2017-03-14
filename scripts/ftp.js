/*

  Purpose: Deploy build to FTP server and update .htaccess file

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let fs = require('fs-extra')
let ftpClient = require('ftp-client')
let abs = require('path').resolve

let config = {
  host: '',
  port: '',
  user: '',
  password: ''
}

// Run
alert('FTP deployment ongoing for version ' + env.pkg.version + ' - please wait ...')
let client = new ftpClient(config) // eslint-disable-line
client.connect(function () {
  alert('Uploading build folder - please wait ...')
  client.upload(abs(env.proj, 'build/www/**/*'), 'build-' + env.pkg.version, {baseDir: abs(env.proj, 'build/www'), overwrite: 'older'}, function (res) {
    if (res.errors === {}) {
      alert('Updating .htaccess file - please wait ...')
      let htaccess = 'RewriteEngine On\n' +
                     'RewriteCond %{REQUEST_URI} !^/build-' + env.pkg.version + '/\n' +
                     'RewriteRule ^(.*)$ /build-' + env.pkg.version + '/$1 [L]\n' +
                     'RewriteCond %{REQUEST_FILENAME} !-f\n' +
                     'RewriteCond %{REQUEST_FILENAME} !-d\n' +
                     'RewriteRule ^build-([0-9.]+)/(.*)?$ /#/$2 [R,L,NE]\n'
      fs.writeFile(abs(env.cache, 'ftp/.htaccess'), htaccess, function (err) {
        if (!err) {
          alert('Uploading .htaccess file - please wait ...')
          client.upload(abs(env.cache, 'ftp/.htaccess'), '', {baseDir: abs(env.cache, 'ftp'), overwrite: 'all'}, function (res) {
            if (res.errors === {}) {
              alert('FTP deployment done for version ' + env.pkg.version + '.')
            } else {
              alert('Failed to update .htaccess file on FTP server.\nDetails:\n' + JSON.stringify(res.errors), 'issue')
            }
          })
        } else {
          alert('Failed to cache .htaccess file.', 'issue')
        }
      })
    } else {
      alert('Failed to upload build folder to FTP server.\nDetails:\n' + JSON.stringify(res.errors), 'issue')
    }
  })
})
