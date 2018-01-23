const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanScssBuildPlugin = require('./clean-scss-build-webpack-plugin');
const normalizedEntries = require('./normalize-entries');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const extractCriticalSass = new ExtractTextPlugin('[name].css');

const getWebpackCriticalConfig = config => {
  const webpackConfig = {
    entry: normalizedEntries(config.criticalAssets.entries, config),
    output: {
      path: path.join(config.sourcePath, config.criticalAssets.destinationDir),
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
