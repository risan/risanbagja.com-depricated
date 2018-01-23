const config = require('./site.config');
const getAssetsConfig = require('./generators/get-webpack-assets-config');
const getCriticalConfig = require('./get-webpack-critical-config');

module.exports = [
  getAssetsConfig(config),
  getCriticalConfig(config)
];
