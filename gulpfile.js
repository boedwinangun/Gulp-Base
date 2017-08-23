/**
 *
 * Konfigurasi Gulp.js
 * @author [Boed Winangun]
 * @version [1.0]
 * 
 */
var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	reload      = browserSync.reload,
	notify      = require('gulp-notify'),
	plumber     = require('gulp-plumber'),
	gutil       = require('gulp-util'),
	path        = require('path'),
	scss        = require('gulp-sass'),
	clean       = require('gulp-clean'),
	cssnano     = require('gulp-cssnano'),
	concat      = require('gulp-concat'),
	uglify      = require('gulp-uglify'),
	imagemin    = require('gulp-imagemin'),
	htmlmin     = require('gulp-htmlmin'),
	merge       = require('merge-stream'), 
	zip         = require('gulp-zip');

/**
 *
 * error reporter object
 *
 */
var reportError = function (error) { 
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';
    var pluginName = (error.plugin) ? ': ['+error.plugin+']' : '['+currentTask+']';
 
    notify({
        title: 'Task Failed '+ pluginName,
		icon: path.join(__dirname, 'gulp.png'),
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

/**
 *
 * Compile SCSS
 *
 */
gulp.task('scss', function(){
	return gulp.src('./app/scss/**.scss')
	.pipe(plumber({
	    errorHandler: reportError
	}))
	.pipe(scss())
	.pipe(gulp.dest('./app/css'))
	.pipe(notify({ message: 'SCSS task complete' }))
	.pipe(reload({stream: true}));
});

/**
 *
 * Task Clean Build Directory
 *
 */
gulp.task('cleanBuild', function(){
	return gulp.src('build', {read: false})
	.pipe(clean());
});

/**
 *
 * Deploy ke folder Build
 *
 */
gulp.task('deploy',['cleanBuild'], function(){
	// optimasi css
	var cssOptimize = gulp.src('app/css/*.css')
		.pipe(cssnano())
		.pipe(gulp.dest('build/css'));

	// Menggabungkan semua file js dan optimasi
	var jsOptimize = gulp.src('app/js/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));

	// Optimasi images
	var imgOptimize = gulp.src('app/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('build/images'));

	// Optimasi html
	var htmlOptimize = gulp.src('app/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('build'));

	// Optimasi fonts
	var fonts = gulp.src('app/fonts/**')
		.pipe(gulp.dest('build/fonts'));

	return merge(cssOptimize,jsOptimize,imgOptimize,htmlOptimize,fonts);
})

/**
 *
 * Deploy ke file Zip
 *
 */
gulp.task('deployZip',['deploy'], function(){
	var zipNow = gulp.src('build/**')
		.pipe(zip('deploy.zip'))
		.pipe(gulp.dest('build'));
})

/**
 *
 * Task Local Webserver dan sinkronisasi dengan browser
 *
 */
gulp.task('default', function(){
	browserSync.init({
		server: {
			baseDir: "./app"
		}
	});
	gulp.watch('./app/**/*').on('change', reload);
	gulp.watch('./app/scss/**/*.scss',['scss']);
});