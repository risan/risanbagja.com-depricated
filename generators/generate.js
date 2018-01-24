const processor = require('./processor');

const generate = config =>
  new Promise(async (resolve, reject) => {
    try {
      const results = await Promise.all([
        processor.processRootDirectory(config),
        processor.processPostsDirectory(config)
      ]);

      resolve(results);
    } catch (err) {
      reject(err);
    }
  });

module.exports = generate;
