const getWebpackAssetsConfig = require('./get-webpack-assets-config');
const getCriticalAssetsConfig = require('./get-webpack-critical-config');

module.exports = {
  forAssets: getWebpackAssetsConfig,
  forCriticalAssets: getCriticalAssetsConfig
};
