'use strict';
var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var merge = require('merge-stream');
var order = require('gulp-order');
//var debug = require('gulp-debug');
var basename = require('gulp-css-url-basename');


gulp.task('clean', function () {
    return del('dist');
});

gulp.task('build', function () {
    var vendor = mainBowerFiles({
        overrides: {
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
    var vendor_js = gulp.src(vendor).pipe(filter('*.js'));
    var vendor_css = gulp.src(vendor).pipe(filter('*.css'));
    var vendor_fonts = gulp.src(vendor).pipe(filter(['*.otf', '*.eot', '*.woff', '*.woff2', '*.svg', '*.ttf']));
    //js
    merge(app_js, vendor_js)
        .pipe(order(['bower_components/angular/angular.js', 'bower_components/**/*', 'js/app.js'], {base: '.'}))
        .pipe(concat('app.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/assets'));
    // css
    merge(app_css, vendor_css, gulp.src('css/*.css'))
        .pipe(order(['bower_components/**/*', 'css/**/*'], {base: '.'}))
        .pipe(concat('style.css'))
        .pipe(basename())
        //.pipe(minifycss({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist/assets'));
    merge(vendor_fonts, gulp.src('fonts/*'), gulp.src('images/*'))
        .pipe(gulp.dest('dist/assets'));
    gulp.src(['public/**/*'])
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'build']);
