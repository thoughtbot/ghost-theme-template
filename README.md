# Ghost Theme Template

A project scaffold for building [Ghost](http://github.com/tryghost/ghost/)
themes using Gulp, LibSass, & Autoprefixer.

## Features

- Gulp integration
- Blazing fast LibSass
- Bourbon and Neat
- The amazing power of Autoprefixer
- JSHint with Stylish

## Gulp Tasks

Running `gulp` will initiate the default compile task which will compile all
stylesheets using Sass and Autoprefixer, use JSHint to analyze the javascript,
and watch for changes on both.

Running `gulp deploy` will recompile the theme's stylesheets, create a zip file
of the theme (excluding the `node_modules` directory), and then use
[gscan](https://github.com/TryGhost/gscan) to validate if the theme is compliant
with ghost.

> [Gscan] Checks Ghost themes for errors, deprecations, best practices and looks
> to see which features are supported. Aims to generate a compatibility report
> and feature listing for themes.
