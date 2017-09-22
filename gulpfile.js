var autoprefix = require("gulp-autoprefixer"),
    bourbon    = require("bourbon").includePaths,
    gulp       = require("gulp"),
    jshint     = require("gulp-jshint"),
    neat       = require("bourbon-neat").includePaths,
    sass       = require("gulp-sass"),
    stylish    = require("jshint-stylish");

var paths = {
  scss: "./assets/scss/**/*.scss",
  css: "./assets/css/",
  js: "./assets/js/**/*.js"
};

// Stylesheets

gulp.task("sass", function () {
  return gulp.src(paths.scss)
    .pipe(sass({
      sourcemaps: true,
      includePaths: [bourbon, neat]
    }).on("error", sass.logError))
    .pipe(autoprefix("last 2 versions"))
    .pipe(gulp.dest(paths.css));
});

// Javascript

gulp.task("jshint", function () {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

// Tasks

gulp.task("default", ["sass", "jshint"], function() {
  gulp.watch(paths.scss, ["sass"]);
  gulp.watch(paths.js, ["jshint"]);
});
