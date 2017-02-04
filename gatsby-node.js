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

  config.plugin('copy-webpack-plugin', function () {
    return new CopyWebpackPlugin([
      { from: '../static/img/icons', to: 'icons' },
      { from: '../manifest.json' },
    ])
  })

    return config
};
