var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sassMainPath = 'src/main.scss';
var distPath = 'dist/';

gulp
    .task('default', ['scss', 'watch'])
    .task('scss', function() {
        gulp.src(sassMainPath)
            .pipe($.plumber())
            .pipe($.sourcemaps.init())
            .pipe($.sass())
            .pipe($.autoprefixer())
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(distPath));
    })
    .task('watch', function () {
        gulp.watch('src/**/*.scss', ['scss']);
    });