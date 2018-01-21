const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config = require('./config');

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

const extractSass = new ExtractTextPlugin('[name].css');

module.exports = {
  entry: Object.entries(config.assets.entries).reduce((normalizedEntries, entry) => {
    normalizedEntries[entry[0]] = path.join(config.sourcePath, config.assets.sourceDir, entry[1]);

    return normalizedEntries;
  }, {}),
  devtool: IS_PRODUCTION ? undefined : 'inline-source-map',
  output: {
    path: path.join(config.destinationPath, config.assets.destinationDir),
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
    extractSass
  ]
};

if (IS_PRODUCTION) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin()
  );
}
