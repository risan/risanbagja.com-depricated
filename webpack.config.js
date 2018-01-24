const Config = require('./generators/config');
const siteConfig = require('./site.config');
const webpackConfig = require('./generators/webpack/config');

const config = new Config(siteConfig);

module.exports = [
  webpackConfig.forAssets(config),
  webpackConfig.forCriticalAssets(config)
];
