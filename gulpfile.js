var multiconfig = require('multiconfig');
var config = multiconfig.load();

var gulp = require('gulp');
var download = require('gulp-download');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var reactify = require('reactify');

// resource
var resource = config.build.useCDN ? {
	jquery: config.build.download.jquery,
	'socket.io': config.build.download['socket.io'],
	'semantic.js': config.build.download.semantic.js,
	'semantic.css': config.build.download.semantic.css
} : {
	jquery: '//static.' + config.host.name + '/jquery.min.js',
	'socket.io': '//static.' + config.host.name + '/socket.io.min.js',
	'semantic.js': '//static.' + config.host.name + '/semantic.min.js',
	'semantic.css': '//static.' + config.host.name + '/semantic.min.css',
};
resource['custom.css'] = '//os.' + config.host.name + '/custom.css';

// renameOptions
var renameOptions = path => {
	path.basename = 'app';
	path.extname = '.js';
};

// download

gulp.task('download-all', ['download-jquery', 'download-socket.io', 'download-semantic-css', 'download-semantic-js', 'download-semantic-font']);

gulp.task('download-jquery', function () {
	return download(config.build.download.jquery)
		.pipe(gulp.dest(config.build.static));
});

gulp.task('download-socket.io', function () {
	return download(config.build.download['socket.io'])
		.pipe(gulp.dest(config.build.static));
});

gulp.task('download-semantic-font', function () {
	return download(config.build.download.semantic.font)
		.pipe(gulp.dest(config.build.static + '/themes/default/assets/fonts/'));
});

gulp.task('download-semantic-css', function () {
	return download(config.build.download.semantic.css)
		.pipe(rename(function (path) {
			path.basename = 'semantic.min';
			path.extname = '.css';
		}))
		.pipe(gulp.dest(config.build.static));
});

gulp.task('download-semantic-js', function () {
	return download(config.build.download.semantic.js)
		.pipe(gulp.dest(config.build.static));
});

// copy

gulp.task('copy-all', ['copy-main', 'copy-css']);

// copy-css
gulp.task('copy-css', function () {
	return gulp.src([config.build.source + 'custom.css'])
		.pipe(gulp.dest(config.build.path));
});

// copy-main

gulp.task('copy-main', ['copy-main-html', 'copy-main-images']);

gulp.task('copy-main-html', function () {
	return gulp.src(config.build.source + config.build.index)
		.pipe(replace('»jquery«', resource.jquery))
		.pipe(replace('»socket.io«', resource['socket.io']))
		.pipe(replace('»custom.css«', resource['custom.css']))
		.pipe(replace('»semantic.js«', resource['semantic.js']))
		.pipe(replace('»semantic.css«', resource['semantic.css']))
		.pipe(gulp.dest(config.build.path));
});

gulp.task('copy-main-images', function () {
	return gulp.src([config.build.source + 'images/**/*'])
		.pipe(gulp.dest(config.build.path + 'images'));
});

// build

gulp.task('build-all', ['build-main']);

gulp.task('build-main', function () {
	return gulp.src(config.build.source + config.build.main)
		.pipe(browserify({transform: [reactify]}))
		.pipe(rename(renameOptions))
		.pipe(gulp.dest(config.build.path));
});


// tasks

gulp.task('complete', ['download-all', 'copy-all', 'build-all']);

gulp.task('default', ['copy-main', 'build-main']);
