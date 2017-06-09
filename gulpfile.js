var gulp = require('gulp');

gulp.task('lib', function () {
  gulp.src(['node_modules/vue/dist/vue.min.js'])
    .pipe(gulp.dest('./'));
});
