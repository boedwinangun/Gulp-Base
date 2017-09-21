/**
 *
 * Konfigurasi Gulp.js
 * @author [Boed Winangun]
 *
 */

var gulp        = require('gulp'),
browserSync = require('browser-sync').create(),
reload      = browserSync.reload,

// error event
plumber     = require('gulp-plumber'),


// error reporter object
map         = require('map-stream');
events      = require('events');
notify      = require('gulp-notify'),
emitter     = new events.EventEmitter();
path        = require('path'),
gutil       = require('gulp-util'),

// CSS
scss        = require('gulp-sass'),

// JS
jshint      = require('gulp-jshint'),
  stylish     = require('jshint-stylish'),

// Dist
clean       = require('gulp-clean'),
cssnano     = require('gulp-cssnano'),
concat      = require('gulp-concat'),
uglify      = require('gulp-uglify'),
header      = require('gulp-header'),
imagemin    = require('gulp-imagemin'),
htmlmin     = require('gulp-htmlmin'),
merge       = require('merge-stream'),
zip         = require('gulp-zip'),

paths = {
    root: './',
    source: {
        root: 'build/src/',
        styles: 'build/src/scss/**/*.scss',
        scripts: 'build/src/js/**/*.js'
    },
    build: {
        root: 'build/',
        styles: 'build/css/',
        scripts: 'build/js/',
        fonts: 'build/fonts/',
        images: 'build/images/'
    },
    dist: {
        root: 'dist/',
        styles: 'dist/css/',
        scripts: 'dist/js/',
        fonts: 'dist/fonts/',
        images: 'dist/images/'
    },
    pkg: require('./bower.json'),
    banner: [
        '/**',
        ' * Boed Winangun <%= pkg.version %>',
        ' * <%= pkg.description %>',
        ' * ',
        ' * <%= pkg.homepage %>',
        ' * ',
        ' * Copyright <%= date.year %>, <%= pkg.author %>',
        ' * ',
        ' * Released on: <%= date.month %> <%= date.day %>, <%= date.year %>',
        ' */',
        ''].join('\n'),
    date: {
        year: new Date().getFullYear(),
        month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
        day: new Date().getDate()
    }
}


// Task error reporter SCSS
var reportError = function (error) {
var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';
var pluginName = (error.plugin) ? ': ['+error.plugin+']' : '['+currentTask+']';

notify({
    title: 'Task Failed '+ pluginName,
    message: lineNumber + 'Lihat console.'
}).write(error);

gutil.beep();

var report = '';
var chalk = gutil.colors.white.bgRed;

report += chalk('TASK:') + pluginName+'\n';
report += chalk('ERROR:') + ' ' + error.message + '\n';
if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
if (error.fileName) { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }

console.error(report);
this.emit('end');
}


// Task Compile SCSS
gulp.task('styles', function(){
return gulp.src(paths.source.styles)
    .pipe(plumber({
        errorHandler: reportError
    }))
    .pipe(scss())
    .pipe(gulp.dest(paths.build.styles))
    .pipe(reload({stream: true}));
});


// // Task Compile script
gulp.task('scripts', function(){
gulp.src(paths.source.root + 'js/functions.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gulp.dest(paths.build.scripts));
    
gulp.src(paths.source.root + 'js/plugins/*.js')
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(paths.build.scripts))
    .pipe(reload({stream: true}));
});


// Task Clean folder dist
gulp.task('cleanDist', function(){
return gulp.src(paths.dist.root, {read: false})
    .pipe(clean());
});


// Task produksi ke folder Dist
gulp.task('dist',['cleanDist'], function(){
// optimasi css
var cssOptimize = gulp.src(paths.build.styles + '*.css')
    .pipe(cssnano())
    .pipe(header(paths.banner, { pkg : paths.pkg, date: paths.date }))
    .pipe(gulp.dest(paths.dist.styles));

// Menggabungkan semua file js dan optimasi
var jsOptimize = gulp.src(paths.build.scripts + '*.js')
    .pipe(uglify())
    .pipe(header(paths.banner, { pkg : paths.pkg, date: paths.date }))
    .pipe(gulp.dest(paths.dist.scripts));

// Optimasi html
var html = gulp.src(paths.build.root + '*.html')
    .pipe(gulp.dest(paths.dist.root));

// Optimasi images
var images = gulp.src(paths.build.images + '**/*')
    .pipe(gulp.dest(paths.dist.images));

// Optimasi fonts
var fonts = gulp.src(paths.build.fonts + '**')
    .pipe(gulp.dest(paths.dist.fonts));

return merge(cssOptimize,jsOptimize,html,images,fonts);
})


// Task Produksi ke file Zip
gulp.task('distZip',['dist'], function(){
var zipNow = gulp.src(paths.dist.root + '**')
    .pipe(zip('template.zip'))
    .pipe(gulp.dest(paths.dist.root));
})


// Task Local Webserver dan sinkronisasi browser, perangkat lain (ex: mobile)
gulp.task('default', function(){
browserSync.init({
    // buka projek di Google Chrome
    browser: "chrome",
    server: {
        baseDir: paths.build.root
    }
});
gulp.watch(paths.build.root + '**/*').on('change', reload);
gulp.watch(paths.source.styles,['styles']);
gulp.watch(paths.source.scripts,['scripts']);
});