var gulp = require('gulp');

gulp.task('lib', function () {
  gulp.src(['node_modules/vue/dist/vue.min.js', 'node_modules/vue-chartjs/dist/vue-chartjs.full.min.js'])
    .pipe(gulp.dest('./'));
});
