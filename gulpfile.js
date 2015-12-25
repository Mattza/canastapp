var gulp = require('gulp');
var conn = require('gulp-connect');
var uglify = require('gulp-uglify');
//var gutil = require('gulp-util');
var less = require('gulp-less');
var concat = require('gulp-concat');

gulp.task('serve', function () {
    conn.server({
        root: [__dirname],
        port: 3000,
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('./*.html')
        .pipe(conn.reload());
});

gulp.task('less', function() {

    gulp.src('css/*.less')
        .pipe(concat('style.css'))
        .pipe(less())
        .pipe(gulp.dest('css'))
        .pipe(conn.reload());
})

gulp.task('scripts', function () {
    return gulp.src('*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./js/'))
        .pipe(conn.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./*.js'], ['scripts']);
    gulp.watch(['./css/**/*.less'], ['less']);

});

gulp.task('dist', ['scripts','less'], function () {
    // Page
    gulp.src('index.html')
        .pipe(gulp.dest('dist/'));

    // Favicon
    gulp.src('./favicon.ico')
        .pipe(gulp.dest('dist/'));

    // Scripts
    gulp.src('*.js')
        .pipe(gulp.dest('dist/js/'));

    // Css
    gulp.src('css/*.css')
        .pipe(gulp.dest('dist/css/'));
})

gulp.task('default', ['serve', 'watch', 'scripts']);
