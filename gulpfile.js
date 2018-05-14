// sudo npm install gulp -g
// cd project
// npm init
// npm install gulp --save-dev
// npm install gulp-minify-html gulp-js-minify gulp-if gulp-useref gulp-concat gulp-sourcemaps gulp-uglify del run-sequence gulp-imagemin gulp-cache gulp-clean-css gulp-clean-css --save-dev
// npm install gulp-minify-html --save-dev
// npm install gulp-js-minify--save-dev
// npm install gulp-uglify --save-dev
// npm install gulp-imagemin --save-dev
// npm install gulp-cache --save-dev
// npm install gulp-clean-css --save-dev
// npm install del --save-dev
// npm install run-sequence --save-dev
// <!--build:css css/styles.min.css-->
// <!--endbuild-->
// <!--build:js js/main.min.js -->
// <!-- endbuild -->
var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');
var minifyHTML = require('gulp-minify-html');
var imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
var minifyjs = require('gulp-js-minify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var del = require('del');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var gulpIf = require('gulp-if');

// gulp.task('js', function(){
//   return gulp.src('app/*.html')
//     .pipe(useref())
//     .pipe(gulpIf('*.js', uglify()))

//     .pipe(gulpIf('*.css', cssnano()))
//     .pipe(gulp.dest('dist'))
// });

// gulp.task('html', function() {
//     gulp.src('dist/*.html')
//       .pipe(htmlmin({collapseWhitespace: true}))
//       .pipe(gulp.dest('dist'))
//   });
//   gulp.task('img', function(){
//     return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
//     // Caching images that ran through imagemin
//     .pipe(cache(imagemin({
//         interlaced: true
//       })))
//     .pipe(gulp.dest('dist/img'))
//   });

gulp.task('useref', function(){
    return gulp.src('app/*.html')
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cleanCSS()))
      .pipe(gulp.dest('dist'))
  });
  
gulp.task('js', function () {
    return gulp.src('app/js/*.js')
        // .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});
gulp.task('css', function () {
    return gulp.src('app/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
});
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(minifyHTML({
          comments:true,spare:true
        }))
        .pipe(gulp.dest('dist'))
});
gulp.task('index', function() {
	var opts = {comments:true,spare:true};
  gulp.src('dist/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist'))
});
gulp.task('img', function () {
    return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'))
});
gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})
gulp.task('icons', function () {
    return gulp.src('app/icons/**/*')
        .pipe(gulp.dest('dist/icons'))
})
gulp.task('sound', function () {
    return gulp.src('app/sound/**/*')
        .pipe(gulp.dest('dist/sound'))
})
gulp.task('clean:dist', function () {
    return del.sync('dist');
})
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})



gulp.task('run', function (callback) {
    runSequence('clean:dist', 'cache:clear', 'js', 'css', 'html', "fonts", "sound", 'img','images','icons',callback);
});
gulp.task('default', function (callback) {
    runSequence('clean:dist', 'cache:clear', 'useref', 'fonts', 'index', 'sound', 'img', 'images', 'icons', callback);
});