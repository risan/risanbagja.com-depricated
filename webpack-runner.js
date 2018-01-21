const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);

const run = () => new Promise((resolve, reject) =>
  compiler.run((err, stats) => {
    if (err) {
      return reject(err);
    }

    if (stats.hasErrors()) {
      return reject(stats.toJson().errors);
    }

    resolve(stats);
  }));

const watch = ({ onError = () => {}, onSuccess = () => {} } = {}) => compiler.watch({
  ignored: /node_modules/,
}, (err, stats) => {
  if (err) {
    return onError();
  }

  if (stats.hasErrors()) {
    return onError(stats.toJson().errors);
  }

  onSuccess(stats);
});

const printStats = stats => {
  if (stats.hasWarnings()) {
    console.warn(stats.toJson().warnings);
  }

  console.log(stats.toString({
    cachedAssets: false,
    chunks: false,
    colors: true,
    modules: false
  }));
}

const printError = err => {
  console.error(err.stack || err);

  if (err.details) {
    console.error(err.details);
  }
}

module.exports = {
  run,
  watch,
  printStats,
  printError
};
