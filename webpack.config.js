const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const DeleteBuildFilesPlugin = require('./delete-build-files-plugin');
const config = require('./config');

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

const extractSass = new ExtractTextPlugin('[name].css');

const normalizedEntries = entries =>
  Object.entries(entries).reduce((normalized, entry) => {
    const prop = {};
    prop[entry[0]] = path.join(config.sourcePath, config.assets.sourceDir, entry[1]);

    return Object.assign({}, normalized, prop);
  }, {});

const assetsConfig = {
  entry: normalizedEntries(config.assets.entries),
  devtool: IS_PRODUCTION ? undefined : 'inline-source-map',
  output: {
    path: path.join(config.destinationPath, config.assets.destinationDir),
    filename: '[name].js',
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
                sourceMap: !IS_PRODUCTION,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !IS_PRODUCTION,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    extractSass,
    new DeleteBuildFilesPlugin(
      ['blog.js'],
      path.join(config.destinationPath, config.assets.destinationDir),
    ),
  ],
};

const criticalConfig = {
  entry: normalizedEntries({
    'home-critical': 'scss/home-critical.scss',
  }),
  output: {
    path: path.join(config.sourcePath, config.layoutsDir, 'includes'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    extractSass,

    new DeleteBuildFilesPlugin(
      ['home-critical.js'],
      path.join(config.sourcePath, config.layoutsDir, 'includes'),
    ),
  ],
};

if (IS_PRODUCTION) {
  assetsConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin(),
  );

  criticalConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin(),
  );
}

module.exports = [assetsConfig, criticalConfig];
