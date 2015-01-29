var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var colors = require('colors/safe');

var sassMainPath = 'src/main.scss';
var distPath = 'dist/';

gulp
    .task('default', ['watch', 'scss'])
    .task('scss', function() {
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
            .pipe(gulp.dest(distPath));
    })
    .task('watch', function () {
        gulp.watch('src/**/*.scss', ['scss']);
    });