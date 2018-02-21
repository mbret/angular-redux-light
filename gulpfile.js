let gulp = require('gulp');
let inject = require('gulp-inject');

gulp.task('inject', () => {
    return gulp
        .src('./src/index.html')
        .pipe(inject(
            gulp.src(['./src/**/*.module.js', 'src/**/*.js'], {
                read: false,
            })
        ), {
            ignorePath: "/src",
        })
        .pipe(gulp.dest('./src'));
});