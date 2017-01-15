// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var pkg = require('../package.json')
var proj = require('..' + pkg.projectRoot + 'package.json')
var app = require('..' + pkg.appRoot + 'package.json')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '..' + pkg.appRoot + 'www/build-' + proj.version + '/index.html'),
    assetsRoot: path.resolve(__dirname, '..' + pkg.appRoot + 'www/build-' + proj.version),
    assetsSubDirectory: '',
    assetsPublicPath: '',
    productionSourceMap: app.buildSourcemaps === true ? true : false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: '',
    assetsPublicPath: '',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
