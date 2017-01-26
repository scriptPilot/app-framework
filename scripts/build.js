// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')

var ora = require('ora')
var isThere = require('is-there')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

// Copy babelrc file (will be deleted after build)
var cfg = require('../config')
if (cfg.isInstalled && !isThere(cfg.projectRoot + '.babelrc')) {
  var cpx = require('cpx')
  cpx.copySync(cfg.packageRoot + '.babelrc', cfg.projectRoot + '.babelrc')
}

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
