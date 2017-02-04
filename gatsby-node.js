var rucksack = require('rucksack-css')
var lost = require("lost")
var cssnext = require("postcss-cssnext")
var CopyWebpackPlugin = require('copy-webpack-plugin');

exports.modifyWebpackConfig = function(config, env) {
    config.merge({
        postcss: [
            lost(),
            rucksack(),
            cssnext({
                browsers: ['>1%', 'last 2 versions']
            })
        ]
    })

    config.loader('svg', {
       test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
       loader: 'file-loader',
    })

  config.plugin('copy-webpack-plugin', function () {
    return new CopyWebpackPlugin([
      { from: '../static/img/icons', to: 'icons' },
      { from: '../manifest.json' },
    ])
  })

    return config
};
