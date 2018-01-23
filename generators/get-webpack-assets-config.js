const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanScssBuildPlugin = require('./clean-scss-build-webpack-plugin');
const normalizeEntries = require('./normalize-entries');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin('[name].[contenthash].css');

const getWebpackAssetsConfig = config => {
  const assetOutputPath = path.join(
    config.destinationPath,
    config.assets.destinationDir);

  const webpackConfig = {
    entry: normalizeEntries(config.assets.entries, config),
    devtool: IS_PRODUCTION ? undefined : 'inline-source-map',
    output: {
      path: assetOutputPath,
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: extractSass.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: !IS_PRODUCTION
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: !IS_PRODUCTION
                }
              }
            ],
            fallback: 'style-loader'
          })
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin([
        `${assetOutputPath}/*.css`,
        `${assetOutputPath}/*.js`
      ]),
      extractSass,
      new CleanScssBuildPlugin(),
      new ManifestPlugin({
        publicPath: `${config.url}/${config.assets.destinationDir}/`
      })
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

module.exports = getWebpackAssetsConfig;
