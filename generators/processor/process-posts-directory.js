const getPostMarkdownFiles = require('./../file-util/get-post-markdown-files');
const createPostsIndex = require('./create-posts-index');

const processPostsDirectory = config =>
  new Promise((resolve, reject) =>
    getPostMarkdownFiles({
      sourcePath: config.getPostsSourcePath(),
      destinationPath: config.getPostsDestinationPath(),
      baseUrl: config.getPostsBaseUrl()
    })
      .then(files => {
        const manifest = config.getAssetsManifest();

        Promise.all(
          files.map(({ source, destination, url }) =>
            config.getMarkdownProcessor().process({
              source,
              destination,
              url,
              defaultLayout: config.getPostsDefaultLayout(),
              viewData: {
                config: config.getData(),
                manifest
              }
            })
          )
        )
          .then(results => createPostsIndex(results, config))
          .then(() => {
            console.log('✅ Done processing posts directory...');
            resolve(true);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err))
  );

module.exports = processPostsDirectory;
