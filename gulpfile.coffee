gulp = require 'gulp'
historyApiFallback = require('connect-history-api-fallback')
browserSync = require('browser-sync').create()
reload = browserSync.reload
sass = require('gulp-sass');

gulp.task 'server', ['sass'], ->
  browserSync.init
    files: [
      '*.html'
      'app.css'
      'source/app.js'
    ]
    server:
      baseDir: './'
      middleware: [historyApiFallback()]
  gulp.watch("source/stylesheets/*.sass", ['sass']);
  gulp.watch('**/*.html').on 'change', browserSync.reload


gulp.task 'sass', ->
  gulp.src('source/stylesheets/app.sass')
  .pipe(sass())
  .pipe(gulp.dest('assets'))
  .pipe(browserSync.stream())

gulp.task 'default', ['server']
