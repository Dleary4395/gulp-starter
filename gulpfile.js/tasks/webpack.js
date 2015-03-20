var assign       = require('object-assign')
var config       = require('../config').webpack
var gulp         = require('gulp')
var logger       = require('../lib/compileLogger')
var webpack      = require('webpack')
var browserSync  = require('browser-sync')

gulp.task('webpack:production', function(callback) {
  var prodConfig = Object.create(config)

  prodConfig.plugins = prodConfig.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ])

  webpack(prodConfig, function(err, stats) {
    logger(err, stats)
    callback()
  })
})

gulp.task('webpack:development', function(callback) {
  var built = false
  var devConfig = assign(config, {
    devtool: 'sourcemap',
    debug: true
  })

  webpack(devConfig).watch(200, function(err, stats) {
    logger(err, stats)
    browserSync.reload()
    // On the initial compile, let gulp know the task is done
    if(!built) { built = true; callback() }
  })
})
