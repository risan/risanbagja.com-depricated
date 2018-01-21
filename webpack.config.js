const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config = require('./config');

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

const extractSass = new ExtractTextPlugin('[name].css');

const deleteBuildFiles = (files, buildPath) => {
  Promise.all(files.map(file =>
    fs.remove(path.join(buildPath, file))))
    .then(() => console.log(`🔥 ${files.join(', ')} are deleted`))
    .catch(err => console.error(err));
};

const normalizedEntries = entries =>
  Object.entries(entries).reduce((normalizedEntries, entry) => {
    normalizedEntries[entry[0]] = path.join(config.sourcePath, config.assets.sourceDir, entry[1]);

    return normalizedEntries;
  }, {});

const assetsConfig = {
  entry: normalizedEntries(config.assets.entries),
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
    extractSass,

    function() {
      this.plugin('done', stats =>
        deleteBuildFiles(
          ['blog.js'],
          path.join(config.destinationPath, config.assets.destinationDir)
        ));
    }
  ]
};

const criticalConfig = {
  entry: normalizedEntries({
    'home-critical': 'scss/home-critical.scss'
  }),
  output: {
    path: path.join(config.sourcePath, config.layoutsDir, 'includes'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    extractSass,

    function () {
      this.plugin('done', stats => deleteBuildFiles(
        ['home-critical.js'],
        path.join(config.sourcePath, config.layoutsDir, 'includes')
      ));
    }
  ]
};

if (IS_PRODUCTION) {
  assetsConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin()
  );

  criticalConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin()
  );
}

module.exports = [assetsConfig, criticalConfig];
