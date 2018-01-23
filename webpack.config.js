const config = require('./site.config');
const webpackConfig = require('./generators/webpack/config');

module.exports = [
  webpackConfig.forAssets(config),
  webpackConfig.forCriticalAssets(config)
];
