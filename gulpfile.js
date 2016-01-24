'use strict';

var gulp = require('gulp');
var gulp_webpack = require('webpack-stream');
var gulp_rename = require('gulp-rename');
var gulp_uglify = require('gulp-uglify');
var named = require('vinyl-named');
var webpack = require('webpack');

// ----------------------------------------------------------------------------

var webpack_config = {
    output: {
        filename: '[name].js',
        library: 'choose_file',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, loaders: ['babel'], exclude: /(node_modules|bower_components)/}
        ]
    },
    plugins: [
        // __webpack_hash__
        new webpack.ExtendedAPIPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(true),
        // new webpack.optimize.UglifyJsPlugin({output: {comments: false}, compress: {warnings: false, unused: false}}),
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]))
    ],
    node: {
        fs: "empty"
    }
};

// ----------------------------------------------------------------------------

gulp.task('build', function () {
    return gulp.src(['src/choose-file.js'])
        .pipe(named())
        .pipe(gulp_webpack(webpack_config))
        .pipe(gulp.dest('dist'))
        .pipe(gulp_uglify())
        .pipe(gulp_rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

// ----------------------------------------------------------------------------

gulp.task('default', ['build']);
