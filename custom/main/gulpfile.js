var gulp = require('gulp');
var browserify = require('gulp-browserify');
var reactify = require('reactify');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

var path = {
	ENTRY_POINT: 'web/src/main.jsx',
	DESTINATION: 'web/dist',
	HTML: 'web/src/index.html'
};

var browserifyArguments = {
	transform: [reactify],
};

gulp.task('default', function (callback) {
	return runSequence(
		['copyHTML', 'build']
	);
});

gulp.task('copyHTML', function (callback) {
	return gulp.src(path.HTML)
		.pipe(gulp.dest(path.DESTINATION));
});

gulp.task('build', function (callback) {
	return gulp.src(path.ENTRY_POINT)
		.pipe(browserify({
			transform: [reactify]
		}))
		.pipe(rename(function (path) {
			path.basename = 'app';
			path.extname = '.js';
		}))
		.pipe(gulp.dest(path.DESTINATION));
});
