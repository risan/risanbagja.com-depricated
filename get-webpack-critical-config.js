const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanScssBuildPlugin = require('./generators/clean-scss-build-webpack-plugin');
const normalizedEntries = require('./generators/normalize-entries');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const extractCriticalSass = new ExtractTextPlugin('[name].css');

const getWebpackCriticalConfig = config => {
  const webpackConfig = {
    entry: normalizedEntries({
      'home-critical': 'scss/home-critical.scss',
      'posts-index-critical': 'scss/posts-index-critical.scss'
    }, config),
    output: {
      path: path.join(config.sourcePath, config.layoutsDir, 'includes'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: extractCriticalSass.extract({
            use: ['css-loader', 'sass-loader'],
            fallback: 'style-loader'
          })
        }
      ]
    },
    plugins: [
      extractCriticalSass,
      new CleanScssBuildPlugin()
    ]
  };

  if (IS_PRODUCTION) {
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new OptimizeCssAssetsPlugin()
    );
  }

  return webpackConfig;
};

module.exports = getWebpackCriticalConfig;
