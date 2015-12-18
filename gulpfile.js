var gulp = require('gulp');

var historyApiFallback = require('connect-history-api-fallback');

var browserSync = require('browser-sync').create();

var reload = browserSync.reload;

var sass = require('gulp-sass');

gulp.task('server', ['sass'], function () {
    browserSync.init({
        files: ['*.html', 'app.css', 'source/app.js'],
        server: {
            baseDir: './',
            middleware: [historyApiFallback()]
        }
    });
    gulp.watch("source/stylesheets/*.sass", ['sass']);
    return gulp.watch('**/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src('source/stylesheets/app.sass').pipe(sass()).pipe(gulp.dest('assets')).pipe(browserSync.stream());
});

gulp.task('default', ['server']);
