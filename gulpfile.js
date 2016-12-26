var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

var paths = {
  sass: ['./scss/**/*.scss'],
  templateCache: ['./www/templates/**/*.html'],
  ng_annotate: ['./www/js/*.js'],
  // useref: ['./www/*.html'],
  compress : ['./www/dist/dist_js/app/*.js'],
  minicss : ['./www/css/style.css'],
   sw : ['./www/*','!./www/index.html']
};

gulp.task('default', ['sass', 'templatecache', 'ng_annotate', 'compress','minify-css']);
gulp.task('serve:before', ['default']);
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
   gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
  gulp.watch(paths.ng_annotate, ['ng_annotate']);
  // // gulp.watch(paths.useref, ['useref']);
  gulp.watch(paths.compress, ['compress']);
   gulp.watch(paths.minicss, ['minify-css']);
   gulp.watch(paths.sw, ['generate-service-worker']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});
gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'www';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: ['!./www/lib/*',rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir,
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 5
  }, callback);
});
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('templatecache', function(done){
  gulp.src('./www/templates/**/*.html')
  .pipe(templateCache({standalone:true}))
  .pipe(gulp.dest('./www/js'))
  .on('end', done);
});
 
gulp.task('ng_annotate', function (done) {
  gulp.src('./www/js/*.js')
  .pipe(ngAnnotate({single_quotes: true}))
  .pipe(gulp.dest('./www/dist/dist_js/app'))
  .on('end', done);
});
 
gulp.task('useref', function (done) {
  var assets = useref.assets();
  gulp.src('./www/*.html')
  .pipe(assets)
  .pipe(assets.restore())
  .pipe(useref())
  .pipe(gulp.dest('./www/dist'))
  .on('end', done);
});


gulp.task('compress',['ng_annotate'], function (done) {
  // returns a Node.js stream, but no handling of error messages
  gulp.src('./www/dist/dist_js/app/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./www/dist')).on('end', done);;
});

gulp.task('minify-css', function(done) {
  gulp.src('./www/css/style.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./www/dist')).on('end', done);;
});