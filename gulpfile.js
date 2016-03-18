var gulp   = require('gulp');
var concat = require('gulp-concat');
var del    = require('del');

gulp.task('clean', function () {
    return del('./inception.js');
});

gulp.task('scripts', function() {
    return gulp.src(['./src/auth/oauth.js','./src/crud/crud.js','./src/**/*.js'])
        .pipe(concat('inception.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['clean', 'scripts']);