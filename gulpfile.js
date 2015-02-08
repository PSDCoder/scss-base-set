var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var colors = require('colors/safe');

var sassMainPath = 'src/main.scss';
var distPath = 'dist/';

var demoScss = 'demo/demo.scss';
var demoFolder = 'demo/';

gulp
    .task('default', ['watch', 'scss', 'demo-scss'])
    .task('scss', function() {
        sassBuild(sassMainPath, distPath);
    })
    .task('demo-scss', function() {
        sassBuild(demoScss, demoFolder);
    })
    .task('watch', function () {
        $.livereload.listen();
        gulp.watch('src/**/*.scss', ['scss']);
        gulp.watch(demoScss, ['demo-scss']);

        gulp.watch('demo/index.html')
            .on('change', function (e) {
                $.livereload.changed(e.path);
            });
    });

function sassBuild(sassMainPath, distPath) {
    gulp.src(sassMainPath)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested',
            errLogToConsole: false,
            onError: function(err) {
                return console.log(
                    colors.red.underline(err.message + "\nin " + err.file + "\non " + err.line + ":" + err.column)
                );
            }
        }))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(distPath))
        .pipe($.livereload());
}