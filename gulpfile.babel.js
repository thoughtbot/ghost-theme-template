'use strict';

var gscan      = require("gscan");

import _          from 'lodash';
import autoprefix from 'gulp-autoprefixer';
import bourbon    from 'bourbon';
import chalk      from 'chalk';;
import gulp       from 'gulp';
import jshint     from 'gulp-jshint';
import neat       from 'bourbon-neat';
import pkg        from './package.json';
import run        from 'run-sequence';
import sass       from 'gulp-sass';
import sasslint   from 'gulp-sass-lint';
import stylish    from 'jshint-stylish';
import zip        from 'gulp-zip';

const paths = {
  scss: './assets/stylesheets/**/*.scss',
  css: './assets/css/',
  js: './assets/javascripts/**/*.js',
};

const levels = {
  error: chalk.red,
  warning: chalk.yellow,
  recommendation: chalk.yellow,
  feature: chalk.green
};

gulp.task('sass', () =>
  gulp.src(paths.scss)
    .pipe(sass({
      sourcemaps: true,
      includePaths: [bourbon.includePaths, neat.includePaths]
    }).on('error', sass.logError))
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest(paths.css))
);

gulp.task('sasslint', () =>
  gulp.src([ paths.scss ])
    .pipe(sasslint({
      options: {
        formatter: 'stylish',
      },
      configFile: '.sass-lint.yml',
    }))
    .pipe(sasslint.format())
);

gulp.task('jshint', () =>
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
);

gulp.task('scan', () => {

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
  };

  gscan.checkZip({
    path: `./${pkg.name}.zip`,
    name: pkg.name
  }).then(outputResults);
});

gulp.task('zip',  () =>
  gulp.src(['./**/*', '!./node_modules/**', `!./${pkg.name}.zip`])
    .pipe(zip(`./${pkg.name}.zip`))
    .pipe(gulp.dest('.'))
);

gulp.task('default', ['sass', 'sasslint', 'jshint'], () =>
  gulp.watch(paths.scss, ['sass', 'sasslint']),
  gulp.watch(paths.js, ['jshint'])
);

gulp.task('deploy', (callback) =>
  run('sass', 'zip', 'scan', callback)
);
