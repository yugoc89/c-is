const path = require('path'),
    webpack = require('webpack');

const base = './html/wp',
    baseAssets = './html/wp/wp-content/themes/c-is/assets',
    srcAssets = '/src/wp/wp-content/themes/c-is/assets';

module.exports = {
    watch: true,
    cache: true,
    // output: {
    //     path: path.resolve(base),
    //     publicPath: srcAssets,
    //     filename: 'scripts.min.js'
    // },
    entry: {
        scripts: 'scripts',
        'scripts-sp': 'scripts-sp'
    },
    output: {
        // path: path.resolve(base),
        publicPath: srcAssets,
        path: path.resolve(base),
        filename: '[name].min.js'
    },
    resolve: { 
        root: [path.join(__dirname, srcAssets + '/js')],
        modulesDirectories: [srcAssets + '/js/vendor/' , srcAssets + '/js/components/'],
        alias: { 
            'jquery': __dirname + '/bower_components/jquery/dist/jquery.min',
            'underscore': __dirname + '/bower_components/underscore/underscore-min',
            'backbone': __dirname + '/bower_components/backbone/backbone-min',
            'classie': __dirname + srcAssets + '/js/components/classie',
            'TweenLite': __dirname + srcAssets + '/js/components/TweenMax.min',
            'TimelineLite':__dirname + srcAssets + '/js/components/TimelineLite.min',
        } 
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery",
            jquery: "jquery"
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ]
    }
};
