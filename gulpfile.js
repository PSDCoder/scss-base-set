var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        'serve': 's',
        'watch': 'w',
        'tunnel': 't'
    }
});
var $ = require('gulp-load-plugins')();
var colors = require('colors/safe');
var browserSync = require('browser-sync').create();

var WATCH = !!argv.watch;
var SERVE = !!argv.serve;
var TUNNEL = !!argv.tunnel;

var sassMainPath = 'src/main.scss';
var distPath = 'dist';
var demoFolder = 'demo';
var demoAssetsFolder = path.join(demoFolder, 'assets');
var demoScss = 'demo/assets/demo.scss';
var demoTemplatesRootFolder = path.join(demoFolder, 'templates');
var demoTemplatesFolder = path.join(demoTemplatesRootFolder, 'pages', '*.swig.html');

gulp
    .task('default', function (cb) {
        var tasksList = ['build'];

        if (SERVE) {
            tasksList.push('serve');
        }

        if (WATCH) {
            tasksList.push('watch');
        }

        tasksList.push(cb);

        runSequence.apply(runSequence, tasksList);
    })
    .task('build', function (cb) {
        runSequence(['scss', 'demo-scss', 'demo-templates'], cb);
    })
    .task('scss', function() {
        return sassBuild(sassMainPath, distPath);
    })
    .task('demo-scss', function() {
        return sassBuild(demoScss, demoAssetsFolder);
    })
    .task('demo-templates', function () {
        return gulp.src(demoTemplatesFolder)
            .pipe($.swig({ defaults: { cache: false }}))
            .pipe($.rename(function (path) {
                path.basename = path.basename.replace('.swig', '');
            }))
            .pipe(gulp.dest(demoFolder))
    })
    .task('watch', function () {
        $.watch('src/**/*.scss', function () { runSequence('scss'); })
            .on('error', errorHandler);

        $.watch(demoScss, function () { runSequence('demo-scss'); })
            .on('error', errorHandler);

        $.watch(path.join(demoTemplatesRootFolder, '**', '*.swig.html'), function () { runSequence('demo-templates'); })
            .on('error', errorHandler);

        if (SERVE) {
            $.watch([
                    path.join(demoFolder, '*.html'),
                    path.join(demoAssetsFolder, '*.?(css|js)'),
                    path.join(distPath, '*.css')
                ])
                .on('change', browserSync.reload)
                .on('error', errorHandler)
        }
    })
    .task('serve', function(cb) {
        browserSync.init({
            server: {
                baseDir: '.'
            },
            tunnel: TUNNEL,
            startPath: 'demo/index.html'
        }, cb);
    });


function sassBuild(sassMainPath, distPath) {
    var stream = gulp.src(sassMainPath)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested'
        }).on('error', sassErrorHandler))

        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(distPath));

    if (SERVE) {
        stream = stream.pipe(browserSync.stream());
    }

    return stream;
}

function sassErrorHandler(error) {
    error.messageFormatted = colors.red(error.messageFormatted);
    return $.sass.logError.call(this, error);
}

function errorHandler(error) {
    return console.log(colors.red(
        error.message + "\nin " + error.file + "\non " + error.line + ":" + error.column
    ));
}