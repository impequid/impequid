var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var reactify = require('reactify');
var download = require('gulp-download');
var runSequence = require('run-sequence');

var path = {
	HTML: 'web/src/index.html',

	OUT: 'build.js',
	MINIFIED_OUT: 'build.min.js',

	DEST: 'web/dist',
	ENTRY_POINT: 'web/src/components/main.jsx',

	DOWNLOADS: 'web/lib',

	semanticUI: 'web/lib/semantic.min.js',
	jQuery: 'web/lib/jquery.min.js'
};

var url = {
	semanticUI: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.12.3/semantic.min.js',
	jQuery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js'
};

var browserifyArguments = {
	transform: [reactify],
	shim: {
		'jQuery': {
			path: path.jQuery,
			exports: '$'
		},
		'semantic-ui': {
			path: path.semanticUI,
			exports: null,
			depends: {
				jQuery: 'jquery'
			}
		}
	}
};

gulp.task('downloadSemantic', function () {
	return download(url.semanticUI)
		.pipe(gulp.dest(path.DOWNLOADS));
});

gulp.task('downloadJQuery', function () {
	return download(url.jQuery)
		.pipe(gulp.dest(path.DOWNLOADS));
});

gulp.task('build', function () {
	return gulp.src(path.ENTRY_POINT)
		.pipe(browserify(browserifyArguments))
		.pipe(rename(function (path) {
			path.basename = 'app';
			path.extname = '.js';
		}))
		.pipe(gulp.dest(path.DEST));
});

gulp.task('copyHTML', function (callback) {
	callback();
});

gulp.task('copyImages', function (callback) {
	callback();
});

gulp.task('default', function (callback) {
	runSequence(
		['copyHTML', 'copyImages'],
		['downloadSemantic', 'downloadJQuery'],
		'build',
		callback
	);
});
