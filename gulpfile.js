/* jshint node:true */
'use strict';
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files')();
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
    .pipe($.concat('main.min.css'))
    .pipe($.sass({
      outputStyle: 'nested'
    }))
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('./dist/css'));

  gulp.src(mainBowerFiles)
    .pipe($.filter('*.css'))
    .pipe($.concat('plugins.min.css'))
    .pipe($.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('scripts', function(){
  gulp.src(mainBowerFiles)
    .pipe($.filter('*.js'))
    .pipe($.concat('plugins.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js'));
  
  gulp.src(paths.scripts)
    .pipe($.concat('app.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js'));
});


gulp.task('moveshit', function(){
  gulp.src(['app/fonts/**/*'])
    .pipe(gulp.dest('./dist/fonts'));

  gulp.src('app/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('./dist/img'));
});


gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('default', ['styles', 'scripts', 'styles', 'moveshit']);




gulp.task('watch', function() {
  
  var server = require('gulp-webserver');

  // gulp.watch(['app/**/*.js','app/**/*.css', 'app/**/*.html'], ['scripts','styles']);

  gulp.watch([
    'app/*.html',
    'app/js/**/*.js',
    'app/img/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/**/*.scss', ['styles']);
  
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true
    }));

});
