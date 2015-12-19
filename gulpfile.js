'use strict';
var gulp = require('gulp');
var historyApiFallback = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var jspm = require('gulp-jspm-build');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var merge = require('merge-stream');
var order = require('gulp-order');
var debug = require('gulp-debug');
/*gulp.task('build', function(){
 'use strict';
 jspm({
 bundleOptions: {
 minify: true,
 mangle: true
 },
 bundles: [
 { src: 'app.js', dst: 'app.js' }
 ]
 }).pipe(gulp.dest('dist'));
 });*/

gulp.task('server', ['sass'], function () {
    browserSync.init({
        files: ['*.html', 'app.css', 'app.js'],
        server: {
            baseDir: './',
            middleware: [historyApiFallback()]
        }
    });
    gulp.watch('css/*.sass', ['sass']);
    return gulp.watch('**/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src('css/app.sass')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('build', ['sass'], function () {
    var vendor = mainBowerFiles({
        overrides: {
            'angular-data-table': {
                main: ['release/dataTable.helpers.js', 'release/dataTable.css', 'release/material.css']
            },
            'font-awesome': {
                main: ['css/font-awesome.css', 'fonts/*']
            },
            'angular-i18n': {
                main: 'angular-locale_zh-CN.js'
            }
        }
    });
    var app_css = gulp.src('css/app.sass')
        .pipe(sass())
        .pipe(autoprefixer());
    var app_js = gulp.src('js/app.js');
    var app_fonts = gulp.src('fonts/*');
    var vendor_js = gulp.src(vendor).pipe(filter('*.js'));
    var vendor_css = gulp.src(vendor).pipe(filter('*.css'));
    var vendor_fonts = gulp.src(vendor).pipe(filter(['*.otf', '*.eot', '*.woff', '*.woff2', '*.svg', '*.ttf']));
    //js
    merge(app_js, vendor_js)
        .pipe(order(['bower_components/angular/angular.js', 'bower_components/**/*', 'js/app.js'], {base: '.'}))
        .pipe(debug())
        .pipe(concat('app.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('dist'));
    // css
    merge(app_css, vendor_css)
        .pipe(order(['bower_components/**/*', 'css/**/*'], {base: '.'}))
        .pipe(concat('style.css'))
        //.pipe(minifycss({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist'));
    merge(app_fonts, vendor_fonts)
        .pipe(gulp.dest('dist/fonts'));
    gulp.src(['public/**/*'])
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['server']);
