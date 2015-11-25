gulp = require 'gulp'
browserSync = require('browser-sync').create()
reload = browserSync.reload

gulp.task 'server', ->
  browserSync.init
    server:
      baseDir: './'
  gulp.watch('*.html').on 'change', browserSync.reload
gulp.task 'default', ['server']
