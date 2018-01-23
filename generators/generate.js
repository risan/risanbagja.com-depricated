const processor = require('./processor');

const generate = config =>
  new Promise((resolve, reject) =>
    Promise.all([
      processor.processRootDirectory(config),
      processor.processPostsDirectory(config)
    ])
      .then(() => resolve(true))
      .catch(err => reject(err))
  );

module.exports = generate;
