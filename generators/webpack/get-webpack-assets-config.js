const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanScssBuildPlugin = require('./clean-scss-build-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin('[name].[contenthash].css');

const getWebpackAssetsConfig = config => {
  const assetOutputPath = config.getAssetsDestinationPath();

  const webpackConfig = {
    entry: config.getNormalizedAssetsEntries(),
    devtool: IS_PRODUCTION ? undefined : 'inline-source-map',
    output: {
      path: assetOutputPath,
      filename: '[name].[hash].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
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
      new webpack.DefinePlugin({
        URL: JSON.stringify(config.url.toString())
      }),
      new CleanWebpackPlugin(
        [`${assetOutputPath}/*.css`, `${assetOutputPath}/*.js`],
        {
          allowExternal: true
        }
      ),
      extractSass,
      new CleanScssBuildPlugin(),
      new ManifestPlugin({
        publicPath: `${config.getAssetsBaseUrl()}/`
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
