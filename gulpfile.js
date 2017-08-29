/**
 *
 * Konfigurasi Gulp.js
 * @author [Boed Winangun]
 *
 */

var gulp    	= require('gulp'),
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
	imagemin    = require('gulp-imagemin'),
	htmlmin     = require('gulp-htmlmin'),
	merge       = require('merge-stream'),
	zip         = require('gulp-zip');


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
gulp.task('scss', function(){
	return gulp.src('./app/scss/**.scss')
	.pipe(plumber({
	    errorHandler: reportError
	}))
	.pipe(scss())
	.pipe(gulp.dest('./app/css'))
	.pipe(reload({stream: true}));
});


// Task error reporter JSHint
gulp.task('jshint', function(){
	return gulp.src(['./app/js/**/*.js'])
	.pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, {beep: true}))
    .pipe( map( function ( file, callback ) {
	    if ( ! file.jshint.success ) {
	        var msg = [];
	        file.jshint.results.forEach( function ( err, i ) {
	            if ( err ) {
	                // Pesan Error
	                msg.push(
	                    '#' + ( i + 1 ) + '\t' + 'Line: ' + err.error.line + '\t' + path.basename(file.path) + '\n' +
	                    err.error.reason
	                );
	            }
	        });
	        emitter.emit('error', new Error('\n' + msg.join('\n')));
	    }
	    callback( null, file );
	})) // Jika ada error tampilkan notif pop up
    .on('error', notify.onError(function (error) {
      	return error.message;
    }))
	.pipe(reload({stream: true}));
});


// Task Clean folder dist
gulp.task('cleanDist', function(){
	return gulp.src('dist', {read: false})
	.pipe(clean());
});


// Task produksi ke folder Dist
gulp.task('dist',['cleanDist'], function(){
	// optimasi css
	var cssOptimize = gulp.src('app/css/*.css')
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'));

	// Menggabungkan semua file js dan optimasi
	var jsOptimize = gulp.src('app/js/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));

	// Optimasi images
	var imgOptimize = gulp.src('app/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));

	// Optimasi html
	var htmlOptimize = gulp.src('app/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist'));

	// Optimasi fonts
	var fonts = gulp.src('app/fonts/**')
		.pipe(gulp.dest('dist/fonts'));

	return merge(cssOptimize,jsOptimize,imgOptimize,htmlOptimize,fonts);
})


// Task Produksi ke file Zip
gulp.task('distZip',['dist'], function(){
	var zipNow = gulp.src('dist/**')
		.pipe(zip('template.zip'))
		.pipe(gulp.dest('dist'));
})


// Task Local Webserver dan sinkronisasi browser, perangkat lain (ex: mobile)
gulp.task('default', function(){
	browserSync.init({
		// buka projek di Google Chrome
		browser: "chrome",
		server: {
			baseDir: "./app"
		}
	});
	gulp.watch('./app/**/*').on('change', reload);
	gulp.watch('./app/scss/**/*.scss',['scss']);
    gulp.watch(['./app/js/**/*.js'], ['jshint']);
});