'use strict';

import gulp from 'gulp';
import gulp_webpack from 'webpack-stream';
import named from 'vinyl-named';
import webpack from 'webpack';

// ----------------------------------------------------------------------------

var webpack_config = {
    output: {
        filename: '[name].min.js',
        library: 'choose_file',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, loaders: ['babel?presets[]=es2015'], exclude: /(node_modules|bower_components)/}
        ]
    },
    plugins: [
        // __webpack_hash__
        new webpack.ExtendedAPIPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({output: {comments: false}, compress: {warnings: false, unused: false}}),
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]))
    ],
    node: {
        fs: "empty"
    }
};

// ----------------------------------------------------------------------------

gulp.task('js', () => {
    return gulp.src(['src/choose-file.js'])
        .pipe(named())
        .pipe(gulp_webpack(webpack_config))
        .pipe(gulp.dest('dist'));
});

// gulp.task('js-cs', () => {
//     return gulp.src([dirs.src + '/**/*.js', dirs.src + '/**/*.jsx'])
//         .pipe(gulp_esformatter())
//         .pipe(gulp.dest(dirs.src));
// });

// ----------------------------------------------------------------------------

gulp.task('default', ['js']);
