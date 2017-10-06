var _          = require("lodash"),
    autoprefix = require("gulp-autoprefixer"),
    bourbon    = require("bourbon").includePaths,
    chalk      = require('chalk'),
    gscan      = require("gscan"),
    gulp       = require("gulp"),
    jshint     = require("gulp-jshint"),
    neat       = require("bourbon-neat").includePaths,
    package    = require("./package.json"),
    run        = require("run-sequence"),
    sass       = require("gulp-sass"),
    stylish    = require("jshint-stylish"),
    zip        = require("gulp-zip"),
    levels;

var paths = {
  scss: "./assets/scss/**/*.scss",
  css: "./assets/css/",
  js: "./assets/js/**/*.js"
};

levels = {
  error: chalk.red,
  warning: chalk.yellow,
  recommendation: chalk.yellow,
  feature: chalk.green
};

gulp.task("sass", function () {
  return gulp.src(paths.scss)
    .pipe(sass({
      sourcemaps: true,
      includePaths: [bourbon, neat]
    }).on("error", sass.logError))
    .pipe(autoprefix("last 2 versions"))
    .pipe(gulp.dest(paths.css));
});

gulp.task("jshint", function () {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("scan", function() {
  function outputResult(result) {
    console.log('-', levels[result.level](result.level), result.rule);
  }

  function outputResults(theme) {
    theme = gscan.format(theme);

    console.log(chalk.bold.underline('\nRule Report:'));

    if (!_.isEmpty(theme.results.error)) {
      console.log(chalk.red.bold.underline('\n! Must fix:'));
      _.each(theme.results.error, outputResult);
    }

    if (!_.isEmpty(theme.results.warning)) {
      console.log(chalk.yellow.bold.underline('\n! Should fix:'));
      _.each(theme.results.warning, outputResult);
    }

    if (!_.isEmpty(theme.results.recommendation)) {
      console.log(chalk.red.yellow.underline('\n? Consider fixing:'));
      _.each(theme.results.recommendation, outputResult);
    }

    if (!_.isEmpty(theme.results.pass)) {
      console.log(chalk.green.bold.underline('\n\u2713', theme.results.pass.length, 'Passed Rules'));
    }

    console.log('\n...checks complete.');
  }

  return gscan.checkZip({
    path: `./${package.name}.zip`,
    name: package.name
  })
  .then(outputResults);
});

gulp.task("zip", function() {
  return gulp.src(["./**/*", "!./node_modules/**"])
    .pipe(zip(`./${package.name}.zip`))
    .pipe(gulp.dest("."));
});

gulp.task("default", ["sass", "jshint"], function() {
  gulp.watch(paths.scss, ["sass"]);
  gulp.watch(paths.js, ["jshint"]);
});

gulp.task("deploy", function(callback) {
  run("sass", "zip", "scan", callback);
});
