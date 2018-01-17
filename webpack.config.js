const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin('[name].css');

module.exports = {
  entry: {
    index: './src/assets/scss/index.scss',
    blog: './src/assets/scss/blog.scss'
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'public/assets'),
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
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
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
