/* jshint node:true */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
  img: ['./app/img/**/*'],
  scripts: ['./app/**/*.js'],
  styles: ['./app/**/*.scss'],
  templates: ['./app/templates/**/*.html']
};


gulp.task('styles', function () {
  gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10
    }))
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('./dist/css'));

  gulp.src($.mainBowerFiles())
    .pipe($.filter('*.css'))
    .pipe(concat('plugins.min.css'))
    .pipe($.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./dist/css'))
    .on('end', done);
});


gulp.task('scripts', function(done){
  gulp.src($.mainBowerFiles())
    .pipe($.filter('*.js'))
    .pipe(concat('plugins.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js'))
    .on('end', done);
  
  gulp.src(paths.scripts)
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .on('end', done);
});


gulp.task('moveshit', function(done){
  gulp.src(['app/fonts/**/*'])
    .pipe(gulp.dest('./dist/fonts'))
    .on('end', done);

  gulp.src('app/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('./dist/img'));
});


gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('default', ['styles', 'jsplugins','cssplugins', 'moveshit']);




gulp.task('watch', function() {
  
  var server = require('gulp-server-livereload');

  gulp.watch(['./app/**/*.js','./app/**/*.css'], ['scripts','styles']);
  
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));

});
