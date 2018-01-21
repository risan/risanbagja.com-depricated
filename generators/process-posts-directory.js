const { URL } = require('url');
const path = require('path');
const getPostMarkdownFiles = require('./file-util/get-post-markdown-files');
const MarkdownProcessor = require('./markdown-processor');
const createPostsIndex = require('./create-posts-index');

const processPostsDirectory = config => new Promise((resolve, reject) =>
  getPostMarkdownFiles({
    sourcePath: path.join(config.sourcePath, config.posts.sourceDir),
    destinationPath: path.join(config.destinationPath, config.posts.destinationDir),
    baseUrl: new URL(config.posts.destinationDir, config.url),
  })
    .then((files) => {
      const markdownProcessor = new MarkdownProcessor({
        defaultLayout: config.posts.defaultLayout,
        layoutsPath: path.join(config.sourcePath, config.layoutsDir),
        defaultMinify: config.minifyOutput,
      });

      Promise.all(files.map(({ source, destination, url }) =>
        markdownProcessor.process({
          source,
          destination,
          url,
          viewData: {
            config,
          },
        })))
        .then(results => createPostsIndex(results, config))
        .then(() => {
          console.log('✅ Done processing posts directory...');
          resolve(true);
        })
        .catch(err => reject(err));
    })
    .catch(err => reject(err)));

module.exports = processPostsDirectory;
