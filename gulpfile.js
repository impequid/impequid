var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var reactify = require('reactify');
var download = require('gulp-download');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
// var uglify = require('gulp-uglify');

var path = {
	HTML: 'web/src/index.html',

	OUT: 'build.js',
	MINIFIED_OUT: 'build.min.js',

	IMAGES: ['web/src/images/**/*'],
	DEST_IMAGES: 'web/dist/images',

	DEST: 'web/dist',
	ENTRY_POINT: 'web/src/components/main.jsx',

	semanticUI: 'web/static/semantic.min.js',
	jQuery: 'web/static/jquery.min.js',

	AUTOBUILD: 'web/src/**/*',

	FONT: 'web/static/themes/default/assets/fonts/',

	APPS: 'apps',

	FILES_ENTRY_POINT: 'apps/files/web/src/main.jsx',
	FILES_DEST: 'apps/files/web/dist',

	NOTES_ENTRY_POINT: 'apps/notes/web/src/main.jsx',
	NOTES_DEST: 'apps/notes/web/dist',

	STATIC: 'web/static'
};

var url = {
	semanticUI: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.2/semantic.min.js',
	jQuery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
	semanticUICSS: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.2/semantic.min.css',
	semanticUIFont: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.2/themes/default/assets/fonts/icons.woff2',
	socketIOClient: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js'
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
		.pipe(gulp.dest(path.STATIC));
});

gulp.task('downloadJQuery', function () {
	return download(url.jQuery)
		.pipe(gulp.dest(path.STATIC));
});

gulp.task('downloadSIO', function () {
	return download(url.socketIOClient)
		.pipe(gulp.dest(path.STATIC));
});

gulp.task('downloadSemanticCSS', function () {
	return download(url.semanticUICSS)
		.pipe(rename(function (path) {
			path.basename = 'semantic.min';
			path.extname = '.css';
		}))
		.pipe(gulp.dest(path.STATIC));
});

gulp.task('downloadSemanticFont', function () {
	return download(url.semanticUIFont)
		.pipe(gulp.dest(path.FONT));
});

gulp.task('build', function () {
	return gulp.src(path.ENTRY_POINT)
		.pipe(browserify(browserifyArguments))
		.pipe(rename(function (path) {
			path.basename = 'app';
			path.extname = '.js';
		}))
		// .pipe(uglify())
		.pipe(gulp.dest(path.DEST));
});

gulp.task('copyHTML', function () {
	return gulp.src(path.HTML)
		.pipe(gulp.dest(path.DEST));
});

gulp.task('copyImages', function (callback) {
	return gulp.src(path.IMAGES)
		.pipe(gulp.dest(path.DEST_IMAGES));
});

gulp.task('download', function (callback) {
	return runSequence(
		['copyHTML', 'copyImages'],
		['downloadSemantic', 'downloadSIO', 'downloadJQuery', 'downloadSemanticCSS', 'downloadSemanticFont'],
		'build',
		callback
	);
});

gulp.task('complete', function (callback) {
	return runSequence(
		['copyHTML','copyImages'],
		['downloadSemantic', 'downloadSIO', 'downloadJQuery', 'downloadSemanticCSS', 'downloadSemanticFont'],
		['build', 'files', 'notes'],
		callback
	);
});

gulp.task('default', function (callback) {
	return runSequence(
		['copyHTML', 'copyImages'],
		'build',
		callback
	);
});

gulp.task('autobuild', function (callback) {
	watch(path.AUTOBUILD, {ignoreInitial: false}, function() {
    	gulp.start('default');
	});
});

gulp.task('autobuildnodownload', function (callback) {
	watch(path.AUTOBUILD, {ignoreInitial: false}, function() {
    	gulp.start('nodownload');
	});
});

gulp.task('download', function (callback) {
	return download(url.socketIOClient)
		.pipe(gulp.dest(path.STATIC));
});

// files

gulp.task('files', function (callback) {
	return runSequence(
		['copyFilesHTML', 'buildFiles']
	);
});

gulp.task('copyFilesHTML', function (callback) {
	return gulp.src(path.APPS + '/files/web/src/index.html')
		.pipe(gulp.dest(path.APPS + '/files/web/dist'));
});

gulp.task('buildFiles', function (callback) {
	return gulp.src(path.FILES_ENTRY_POINT)
		.pipe(browserify({
			transform: [reactify]
		}))
		.pipe(rename(function (path) {
			path.basename = 'app';
			path.extname = '.js';
		}))
		.pipe(gulp.dest(path.FILES_DEST));
});

// notes

gulp.task('notes', function (callback) {
	return runSequence(
		['copyNotesHTML', 'buildNotes']
	);
});

gulp.task('copyNotesHTML', function (callback) {
	return gulp.src(path.APPS + '/notes/web/src/index.html')
		.pipe(gulp.dest(path.APPS + '/notes/web/dist'));
});

gulp.task('buildNotes', function (callback) {
	return gulp.src(path.NOTES_ENTRY_POINT)
		.pipe(browserify({
			transform: [reactify]
		}))
		.pipe(rename(function (path) {
			path.basename = 'app';
			path.extname = '.js';
		}))
		.pipe(gulp.dest(path.NOTES_DEST));
});
