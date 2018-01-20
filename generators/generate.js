const processRootDirectory = require('./process-root-directory');
const processPostsDirectory = require('./process-posts-directory');

const generate = config => new Promise((resolve, reject) =>
  Promise.all([processRootDirectory(config), processPostsDirectory(config)])
    .then(() => resolve(true))
    .catch(err => reject(err)));

module.exports = generate;
