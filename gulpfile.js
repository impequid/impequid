var gulp        = require('gulp');
var gutil       = require('gulp-util');
var rename      = require('gulp-rename');
var replace     = require('gulp-replace');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var exorcist    = require('exorcist');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();

var resource = {
	'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
	'socket.io': 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js',
	'semantic.js': 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.2/semantic.min.js',
	'semantic.css': 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.2/semantic.min.css'
};

// default

gulp.task('default', ['copy', 'build']);

// build

gulp.task('build', ['build-api', 'build-bundle']);

gulp.task('build-api', function () {
	return gulp.src('./web/source/api/iframe/app.js')
		.pipe(browserify())
		.pipe(gulp.dest('./web/build/api/iframe/'));
});

gulp.task('build-bundle', function () {
	// return
});

// copy

gulp.task('copy', ['copy-html']);

gulp.task('copy-html', function() {
	return gulp.src('./web/source/index.html')
		.pipe(replace('»jquery«', resource.jquery))
		.pipe(replace('»socket.io«', resource['socket.io']))
		.pipe(replace('»semantic.js«', resource['semantic.js']))
		.pipe(replace('»semantic.css«', resource['semantic.css']))
		.pipe(gulp.dest('./web/build/'));
});

gulp.task('copy-api', function () {
	return gulp.src('./web/source/api/**/*.html')
		.pipe(gulp.dest('./web/build/api/'));
});

// watch

gulp.task('watch', ['copy', 'watch-bundle', 'watch-copy'], function () {
	browserSync.init({
		server: "./web/build",
		open: false
	});
});

gulp.task('watch-copy', ['watch-copy-html']);

gulp.task('watch-copy-html', function () {
	return gulp.watch('./web/source/index.html', ['copy-html', browserSync.reload]);
});

gulp.task('watch-copy-api', function () {
	return gulp.watch('./web/source/api/**/*.html', ['copy-api']);
});

gulp.task('watch-bundle', function () {
	return bundle();
});

// bundler
watchify.args.debug = true;

var bundler = watchify(browserify('./web/source/main.jsx', watchify.args));
bundler.transform(babelify.configure({
	sourceMapRelative: 'web/source'
}));
bundler.on('update', bundle);

function bundle () {

	gutil.log('Compiling JS...');

	return bundler.bundle()
		.on('error', function (err) {
			gutil.log(err.message);
			browserSync.notify("Browserify Error!");
			this.emit("end");
		})
		.pipe(exorcist('web/build/app.js.map'))
		.pipe(source('app.js'))
		.pipe(gulp.dest('./web/build'))
		.pipe(browserSync.stream({once: true}));
}
