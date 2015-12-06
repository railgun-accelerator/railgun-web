gulp = require 'gulp'
historyApiFallback = require('connect-history-api-fallback')
browserSync = require('browser-sync').create()
reload = browserSync.reload

gulp.task 'server', ->
  browserSync.init
    files: [
      '*.html'
      'source/**'
    ]
    server:
      baseDir: './'
      middleware: [ historyApiFallback() ]
  gulp.watch('**/*.html').on 'change', browserSync.reload
gulp.task 'default', ['server']
